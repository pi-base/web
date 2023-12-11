import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 83.09,
      branches: 87.36,
      statements: 83.09,
      functions: 81.81,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
