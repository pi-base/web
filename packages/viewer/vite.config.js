import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
  ],
  test: {
    coverage: {
      lines: 80.17,
      branches: 87.84,
      statements: 80.17,
      functions: 80.61,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
