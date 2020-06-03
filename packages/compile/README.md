![build-test](https://github.com/pi-base/compile/workflows/build-test/badge.svg)

Compiles, checks, and published a data bundle for the [π-base viewer](https://github.com/pi-base/viewer)

## Run locally

In the directory containing your data files, run one of

    npx /path/to/compile # if you have a clone of this repo locally
    npx @pi-base/compile # run the latest version from npm

## Publish Action

Actions can be published on a releases branch using `ncc`

    git checkout releases/v1
    git merge master
    yarn release
    git add -f dist/index.js
    git commit
    git push

Once stable, they probably should be [given a tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md
