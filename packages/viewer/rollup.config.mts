import type { RollupOptions } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import { spawn } from 'node:child_process';
// import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;
const codespaces = process.env.CODESPACES === 'true';

function serve() {
	let server: any;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		name: 'serve',
		writeBundle() {
			// In a codespace, we run the various watcher processes in the
			// background
			if (server) { return };

			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const config: RollupOptions = {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			values: {
			  __buildVersion__: process.env.CF_PAGES_COMMIT_SHA || 'unknown',
			  __buildBranch__: process.env.CF_PAGES_BRANCH || 'main',
			},
			preventAssignment: true,
		}),
		css({ output: 'vendor.css' }) as any, // FIXME
		copy({
			targets: [
				{ src: 'fonts/*', dest: 'public/build/fonts' }
			]
		}),
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
            	// // we'll extract any component CSS out into-]
            	// // a separate file - better for performance-]
            	// css: css => {
            	//     css.write('bundle.css');
            	// },
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && !codespaces && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// !production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		// TODO: production && terser()
	],
	watch: {
		clearScreen: false
	}
};

export default config;