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
      lines: 94.1,
      branches: 94.08,
      statements: 94.1,
      functions: 83.54,
      skipFull: true,
      thresholdAutoUpdate: true,
      exclude: ['src/Formula/Grammar.ts'],
    },
  },
})
