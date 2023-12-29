import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

const compileServer = process.env.COMPILE_SERVER_URL || 'http://localhost:3141'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/bundle': {
        target: compileServer,
        rewrite: path => path.replace(/^\/bundle/, ''),
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 82.91,
      branches: 87.36,
      statements: 82.91,
      functions: 80.19,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
