import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 83.41,
      branches: 87.81,
      statements: 83.41,
      functions: 82.52,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
