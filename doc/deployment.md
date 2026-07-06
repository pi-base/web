# Deployment

## Viewer (Cloudflare Workers)

The viewer is migrating from Cloudflare Pages to **Cloudflare Workers** (Static
Assets). Two Workers are produced from this single repo, selected at build time
by the `VITE_CATEGORY` flavor flag (see `categoryConfig` in
`packages/viewer/src/constants.ts`; unset defaults to `topology`, unsupported
values fail the build):

| Worker             | `VITE_CATEGORY` | wrangler env | Site                       |
| ------------------ | ----------- | ------------ | -------------------------- |
| `pi-base-topology` | `topology`  | `topology`   | `topology.pi-base.org`     |
| `pi-base-graphs`   | `graphs`    | `graphs`     | `graphs.pi-base.org` (TBD) |

Worker config lives in `packages/viewer/wrangler.jsonc` (Static Assets + named
environments). Builds run through `bin/build`, which reads the `WORKERS_CI_*`
variables Workers Builds injects for branch/commit metadata.

### Manual deploy

```bash
pnpm --filter core build
VITE_CATEGORY=topology pnpm --filter viewer build
pnpm --filter viewer run cf:deploy:topology   # or cf:deploy:graphs
```

### Continuous deployment (Workers Builds)

Each Worker is connected to this repo through Cloudflare Workers Builds
(the Worker's *Settings → Build*). For both Workers:

- **Root directory:** repo root
- **Build command:** `bin/build`
- **Build environment variable:** `VITE_CATEGORY=topology` (or `graphs`)
- **Deploy command:** `pnpm --filter viewer run cf:deploy:topology` (or `:graphs`)
- **Non-production (preview) deploy command:**
  `pnpm --filter viewer run cf:preview:topology` (or `:graphs`)
- **Build watch paths:** `packages/**`, `bin/**`

A push to the production branch deploys both Workers; pushes to other branches
upload preview versions (`wrangler versions upload`) with their own URLs.

> **The legacy Pages project is unaffected by these changes.** Cloudflare sets
> `CF_PAGES=1` during Pages builds, and `@sveltejs/adapter-cloudflare` checks
> that first, so a Pages build keeps emitting Pages output even with
> `wrangler.jsonc` present. Pages can be decommissioned once the Workers
> deployment owns `topology.pi-base.org`.

### Viewer (Cloudflare Pages — legacy)

Until the cutover, continuous deployment also runs through Cloudflare Pages.

- [⚙️ Configuration](https://dash.cloudflare.com/78c505984bbdc3e69206eecb9471c4de/pages/view/topology/settings/builds-deployments)
- [🔗 Cloudflare deployment URL](https://topology.pages.dev)

A merge to `main` triggers a Pages build (`bin/build`); the adapter output in
`packages/viewer/.svelte-kit/cloudflare` is deployed to `topology.pages.dev`.

Cloudflare Pages is not currently configured to report builds or build failures
directly (see [this Cloudflare community discussion](https://community.cloudflare.com/t/get-slack-webhook-when-pages-build-finished-cloudflare-pages/311019)).
As such, we only get deploy failure notifications through Github action
failure notifications.

## Compiler

Add a semver tag to trigger the [Publish Images CI step](https://github.com/pi-base/web/actions/workflows/images.yaml), which publishes `ghcr.io/pi-base/compile`. You can either

- create a release directly in the Github UI
- run `git tag v#.#.#` and `git push --tags`

## Data

Changes to a data repo ([pi-base/data](https://github.com/pi-base/data),
[pi-base/data-graphs](https://github.com/pi-base/data-graphs)) invoke that
repo's compile workflow, which uploads the compiled bundle to the
corresponding category's public R2 bucket — the `bundleHost` values in
`packages/viewer/src/constants.ts`. (`pi-base/data` also uploads to the legacy
`pi-base-bundles` S3 bucket.)
