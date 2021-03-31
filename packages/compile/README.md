<h2 align="center">π-Base Compiler</h2>
<div align="center">

[![Test](https://github.com/pi-base/compile/workflows/Test/badge.svg?branch=main)](https://github.com/pi-base/compile/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/pi-base/compile/branch/main/graph/badge.svg?token=7JO1N1OXJB)](https://codecov.io/gh/pi-base/compile)

<!-- TODO: CD release, action link -->

Compiles, checks, and publishes a data bundle for the [π-base viewer](https://github.com/pi-base/viewer) to view.

</div>

## Running Locally

In the directory containing your data files, run one of

```bash
$  npx /path/to/compile # if you have a clone of this repo locally
$  npx @pi-base/compile # run the latest version from npm
```

In either case, this should start a server that watches for changes to local files and serves the compiled bundle. To use this bundle with your [viewer](https://github.com/pi-base/viewer), navigate to `/dev` and update your `Host` setting.

## Publishing

Actions can be published on a releases branch using `ncc`

    git checkout releases/v1
    git merge master
    yarn release
    git add -f dist/index.js
    git commit
    git push

Once stable, they probably should be [given a tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md).
