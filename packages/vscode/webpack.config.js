//@ts-check
'use strict'

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path')
const webpack = require('webpack')

/** @type WebpackConfig */
const webExtensionConfig = {
  mode: 'none',
  target: 'webworker',
  entry: {
    extension: './src/extension.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'commonjs',
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false, // most of the bundle size here is dependencies we can't feasibly reduce
  },
  devtool: 'nosources-source-map',
}

module.exports = [webExtensionConfig]
