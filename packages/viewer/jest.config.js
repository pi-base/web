module.exports = {
  bail: 10,
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  errorOnDeprecated: true,
  notify: true,
  notifyMode: "failure-change",
  resetMocks: true,
  testRegex: '^.+\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  transformIgnorePatterns: [
    "/node_modules/",
  ],
};
