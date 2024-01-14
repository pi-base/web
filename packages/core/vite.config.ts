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
      lines: 93.04,
      branches: 93.52,
      statements: 93.04,
      functions: 93.54,
      skipFull: true,
      thresholdAutoUpdate: true,
      exclude: ['src/Formula/Grammar.ts', 'test'],
    },
  },
})
