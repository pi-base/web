<h2 align="center">π-Base Core</h2>
<div align="center">

[![Test](https://github.com/pi-base/core/workflows/Test/badge.svg?branch=main)](https://github.com/pi-base/core/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/pi-base/core/branch/main/graph/badge.svg?token=7JO1N1OXJB)](https://codecov.io/gh/pi-base/core)
[![Release](https://github.com/pi-base/core/workflows/Release/badge.svg?branch=main)](https://github.com/pi-base/code/actions/workflows/release.yml)
[![NPM](https://img.shields.io/npm/v/@pi-base/core?color=blue)](https://www.npmjs.com/package/@pi-base/core)

Shared data model for the [π-Base viewer](https://github.com/pi-base/viewer) and associated utilities.

</div>

## Local Development

Clone the repo and then run

```bash
$ npm install
$ npm run test
```

See the [viewer](https://github.com/pi-base/viewer) and [compiler](https://github.com/pi-base/compile) for examples of usage. This package is mostly internal implementation details, and tends to be fluid and sparsely documented. If you are interested in building on top of this package, please reach out so we can better support you.

# Releasing

```bash
$ npm run build
$ npm run test
$ npm publish
```
