# Unit Testing

All packages should include `test` and `test:watch` scripts:

```bash
# Run tests for all packages once
<root> $ pnpm run

# Run tests once for a single package
<root>/packages/<foo> $ pnpm run test
<root> $ pnpm run --filter <package> test

# Watch and rerun tests
<root>/packages/<foo> $ pnpm run test:watch
<root> $ pnpm run --filter <package> test:watch
```

## Coverage Testing

All packages should similarly support a `test:cov` script which:

- Writes a coverage report to `<package>/coverage/index.html`
- Errors if the coverage threshold is below the current baseline
- Otherwise updates the baseline

This is aimed at incrementally ratcheting up test coverage over time (though if
necessary, the `test.coverage` stats in the relevant `vite.config` can be edited
and reviewed manually).

```bash
# Run tests with coverage checking for all packages
<root> $ pnpm run test:cov

# Run tests with coverage for a single package
<root>/packages/<foo> $ pnpm run test:cov
<root> $ pnpm run --filter <package> test:cov
```

# End-to-End Testing

The `viewer` package supports end-to-end testing using [Cypress](https://cypress.io).
See [their docs](https://docs.cypress.io/) for more guides.

Note Cypress expects to interact with a running server, which must be started
separately (e.g. with `pnpm run dev`). See [./development.md](./development.md)
for more details.

```bash
# Open the Cypress UI for interactive end-to-end test running
# This is recommended for local development, but does not immediately work in a
# Codespace-like environment.
<root>/packages/viewer $ pnpm run cy:open

# Run Cypress tests once headlessly
# This is useful for CI, but cy:open is recommended during local development.
<root>/packages/viewer $ pnpm run cy:run

# Run tests against a non-default server
<root>/packages/viewer $ pnpm run cy:run --config baseUrl=<url>
```

## Fixture vs. live data

`CYPRESS_ENV` selects which deployment to test _and_ the data the suite runs
against:

- **`fixture`** (default, used by `local`/CI) intercepts the data bundle with
  `cypress/fixtures/main.min.json`, so content assertions are deterministic.
- **`live`** (all deployed targets) lets the app fetch its real R2 bundle, so we
  exercise the actual deployment end-to-end and confirm the sites stay
  consistent.

| `CYPRESS_ENV`     | URL                            | Mode    |
| ----------------- | ------------------------------ | ------- |
| `local` (default) | `http://localhost:5173`        | fixture |
| `pages`           | `https://topology.pi-base.org` | live    |
| `workers`         | `topology.pi-base.workers.dev` | live    |
| `graphs`          | `graphs.pi-base.workers.dev`   | live    |
| `preview`         | `$PREVIEW_URL`                 | live    |

The suite runs in both modes; assertions are written to hold against the
real data (stable IDs, math-free name prefixes, behavioral checks) rather than
exact HTML snapshots. Specs that can only hold against fixture-pinned content
(e.g. the space-to-space navigation regression, which follows a description
link that only exists in the fixture) are declared with a `fixtureIt` helper
and show as pending in live runs. Set `CYPRESS_MODE=fixture` to force the
deterministic fixture against a deployed URL while debugging.

The fixture (`cypress/fixtures/main.min.json`) is a hand-curated subset; keep its
tested entities (e.g. `S000001`, `S000004`, `P000001`) in sync with live data.
Note it predates a pi-base property-ID reorganization, so its property `uid`s are
**not** interchangeable with the current bundle's — refresh display fields per
entity, don't bulk-remap by `uid`.

Two things to know when running fixture mode against a production-style build
(`VITE_BUNDLE_HOST=http://localhost:4173 pnpm run build` + `pnpm run preview`):

- The bundle is baked in at build time: with a localhost `VITE_BUNDLE_HOST`,
  `+layout.server.ts` imports `public/refs/heads/main.json` (a symlink to the
  Cypress fixture) and injects it during SSR, so the browser never fetches
  `main.json`. The `cy.intercept` in `cypress/support/commands.ts` is inert in
  this mode (it matters against `pnpm dev` and deployed targets, where the
  client fetches the bundle). To vary fixture data here, edit the fixture and
  rebuild — intercepting won't work.
- Restart the preview server after every rebuild. A still-running server can
  serve HTML referencing the previous build's hashed chunks, which fails with
  "Failed to fetch dynamically imported module".

## Remote End-to-End Testing

The `./bin/e2e` script runs the suite against the deployed targets (live data),
health-checking each first:

```bash
# Cross-consistency check across the live sites (default: pages + workers)
<root> $ ./bin/e2e

# A single live target
<root> $ ./bin/e2e pages
<root> $ ./bin/e2e workers
<root> $ ./bin/e2e graphs

# A Workers preview ("wrangler versions upload" prints a per-version URL)
<root> $ PREVIEW_URL=https://<version>-topology.pi-base.workers.dev ./bin/e2e preview
<root> $ ./bin/e2e https://<version>-topology.pi-base.workers.dev
```

Equivalently, per-target package scripts: `pnpm --filter viewer run
cy:run:pages` (or `:workers` / `:preview` / `:graphs`).
