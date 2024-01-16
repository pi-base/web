# Deployment

## Viewer

Continuous deployment is handled through Cloudflare Pages.

- [⚙️ Configuration](https://dash.cloudflare.com/78c505984bbdc3e69206eecb9471c4de/pages/view/topology/settings/builds-deployments)
- [🔗 Cloudflare deployment URL](https://topology.pages.dev)

The deployment process is generally:

- A PR is approved and merged to `main`
- The Cloudflare app picks up the PR and runs `npm run build`
- Assuming no errors, the built `/packages/viewer/dist` directory is deployed to
  the Cloudflare pages URL `topology.pages.dev`

Cloudflare Pages is not currently configured to report builds or build failures
directly (see [this Cloudflare community discussion](https://community.cloudflare.com/t/get-slack-webhook-when-pages-build-finished-cloudflare-pages/311019)).
As such, we only get deploy failure notifications through Github action
failure notifications.

## Compiler

Add a semver tag to trigger the [Publish Images CI step](https://github.com/pi-base/web/actions/workflows/images.yaml), which publishes `ghcr.io/pi-base/compile`. You can either

- create a release directly in the Github UI
- run `git tag v#.#.#` and `git push --tags`

## Data

Changes to the data repo invoke the released [compile action](https://github.com/pi-base/data/blob/6cc73f720751910ad4ede8a320c1eeff975ee5c3/.github/workflows/compile.yml#L12),
and upload the compiled bundles to the `pi-base-bundles` S3 bucket.
