const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const pegjs = require('rollup-plugin-pegjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [json(), typescript(), nodeResolve(), commonjs(), pegjs()],
}
