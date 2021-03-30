const config = require('@pi-base/dev').jestConfig

module.exports = {
  ...config,
  bail: 10,
  transform: Object.assign(config.transform, {
    '^.+\\.pegjs$': 'pegjs-jest',
  }),
  verbose: true,
}
