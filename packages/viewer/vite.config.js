import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 80.25,
      branches: 87.16,
      statements: 80.25,
      functions: 81,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
