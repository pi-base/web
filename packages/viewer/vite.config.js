import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 79.91,
      branches: 87.84,
      statements: 79.91,
      functions: 80.61,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
