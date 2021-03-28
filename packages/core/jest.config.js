module.exports = {
  bail: 10,
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  errorOnDeprecated: true,
  moduleFileExtensions: ['js', 'ts'],
  notify: true,
  notifyMode: "failure-change",
  resetMocks: true,
  roots: ['src'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}