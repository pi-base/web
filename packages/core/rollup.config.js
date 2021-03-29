import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pegjs from 'rollup-plugin-pegjs'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [json(), typescript(), nodeResolve(), commonjs(), pegjs()],
  },
]
