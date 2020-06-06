[![build-test](https://github.com/pi-base/viewer/workflows/build-test/badge.svg)](https://github.com/pi-base/viewer/actions?query=branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/github/pi-base/viewer/badge.svg?branch=master)](https://coveralls.io/github/pi-base/viewer?branch=master)

**We're wrapping up work on a rewrite. "Write a better README" is on the punch list. Stay tuned.**

# π-Base

The development instance of the π-Base is available at [https://d28ipz1eb3u4z4.cloudfront.net/](https://d28ipz1eb3u4z4.cloudfront.net/) (for now).

## Architecture

The site is powered by a few different projects, all under  [github.com/pi-base](https://github.com/pi-base).

* [core](https://github.com/pi-base/core) - typescript package containing the shared data model (spaces, properties, formulae, &c.). Available on [NPM](https://www.npmjs.com/package/@pi-base/core).
* [compiler](https://github.com/pi-base/compiler) - typescript package using `@pi-base/core` to compile a repository of markdown files into a JSON bundle for the viewer to view. Used in a Github action in the `data` repo. Also available on [NPM](https://www.npmjs.com/package/@pi-base/compiler).
* [data](https://github.com/pi-base/data) - repo containing all actual mathematical content. Once a PR here has been approved and merged, it triggers a compiler run, which pushes the compiled bundle to S3 for the public viewer to fetch.
* [viewer](https://github.com/pi-base/viewer) - this package. Fetches and presents the compiled bundle.

## Development

Clone the repo and run

```bash
$ yarn install
$ yarn start
```

## Deployment

Deployment is automatic on a successful push to `master`. See `.github/actions` and `package.json` for details.

