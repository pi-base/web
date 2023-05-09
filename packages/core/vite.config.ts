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
  test: {
    coverage: {
      lines: 94.51,
      branches: 95.53,
      statements: 94.51,
      functions: 83.54,
      skipFull: true,
      thresholdAutoUpdate: true,
      exclude: ['src/Formula/Grammar.ts'],
    },
  },
})
