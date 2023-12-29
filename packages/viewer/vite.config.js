import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
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
