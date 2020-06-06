[![build-test](https://github.com/pi-base/core/workflows/build-test/badge.svg)](https://github.com/pi-base/core/actions?query=branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/github/pi-base/core/badge.svg?branch=master)](https://coveralls.io/github/pi-base/core?branch=master)

# pi-base/core

Shared data model for the [π-Base viewer](https://github.com/pi-base/viewer) and associated utilities.

## Local Development

Clone the repo and then run

```bash
$ yarn install
$ yarn test
```

See the [viewer](https://github.com/pi-base/viewer) and [compiler](https://github.com/pi-base/compile) for examples of usage. This package is mostly internal implementation details, and tends to be fluid and sparsely documented. If you are interested in building on top of this package, please reach out so we can better support you.

# Releasing

```bash
$ yarn build
$ yarn test
$ yarn publish
```