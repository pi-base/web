## Publish Action

Actions can be published on a releases branch using `ncc`

    git checkout releases/v1
    yarn run ncc build src/main.ts
    git add -f dist/index.js
    git commit
    git push

Once stable, they probably should be [given a tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md
