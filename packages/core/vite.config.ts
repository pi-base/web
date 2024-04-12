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
      lines: 90,
      branches: 90,
      statements: 90,
      functions: 90,
      skipFull: true,
      thresholdAutoUpdate: true,
      exclude: ['src/Formula/Grammar.ts', 'test'],
    },
  },
})
