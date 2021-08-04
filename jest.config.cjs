const path = require('path')
const { lstatSync, readdirSync } = require('fs')

const basePath = path.resolve(__dirname, 'packages')
const packages = readdirSync(basePath).filter((name) => {
  return lstatSync(path.join(basePath, name)).isDirectory()
})

const moduleNameMapper = packages.reduce((acc, name) => {
  const key = `@pi-base/${name}(.*)$`
  const value = `<rootDir>/packages/./${name}/src/$1`

  acc[key] = value
  return acc
}, {})

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  errorOnDeprecated: true,
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper,
  notify: true,
  notifyMode: 'failure-change',
  preset: 'ts-jest/presets/default-esm',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
}
