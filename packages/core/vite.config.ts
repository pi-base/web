/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    outDir: './dist',
  },
  // See https://stackoverflow.com/questions/75701724
  resolve: {
    preserveSymlinks: true,
  },
  test: {
    coverage: {
      lines: 92.52,
      branches: 95.32,
      statements: 92.52,
      functions: 83.33,
      skipFull: true,
      thresholdAutoUpdate: true,
      exclude: ['src/Formula/Grammar.ts'],
    },
  },
})
