_⚠️ We're actively re-working the infrastructure process. This document describes the new process, which may not be fully real yet. See `Appendix: Legacy` for relevant legacy details._

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

_FIXME: the compiler action does not currently have a working deploy process._

## Data

Changes to the data repo invoke the released [compile action](https://github.com/pi-base/data/blob/6cc73f720751910ad4ede8a320c1eeff975ee5c3/.github/workflows/compile.yml#L12),
and upload the compiled bundles to the `pi-base-bundles` S3 bucket.

# Appendix: Legacy

## Viewer

[topology.pi-base.org](https://topology.pi-base.org/) points to [an AWS CloudFront Distribution](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/E13RN2QUM1YTTK)
in the `pibase` AWS account (`893999385831`), which fronts content in the `pi-base-viewer` S3 bucket. Legacy deploys work by uploading the viewer assets to this bucket.

## Compiler

See [the `pi-base/compiler` repository's notes on publishing](https://github.com/pi-base/compile#publishing).
