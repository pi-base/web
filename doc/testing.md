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

| `CYPRESS_ENV`        | URL                                  | Mode    |
| -------------------- | ------------------------------------ | ------- |
| `local` (default)    | `http://localhost:5173`              | fixture |
| `pages`              | `https://topology.pi-base.org`       | live    |
| `workers`            | `pi-base-topology.…workers.dev`      | live    |
| `graphs`             | `pi-base-graphs.…workers.dev`        | live    |
| `preview`            | `$PREVIEW_URL`                       | live    |

A handful of specs assert exact, fixture-pinned output (e.g. snapshotted KaTeX
HTML); these are wrapped in `fixtureOnly(...)` and skip automatically on live
runs. Set `CYPRESS_MODE=fixture` to force the deterministic fixture against a
deployed URL while debugging.

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
<root> $ PREVIEW_URL=https://<version>-pi-base-topology.<subdomain>.workers.dev ./bin/e2e preview
<root> $ ./bin/e2e https://<version>-pi-base-topology.<subdomain>.workers.dev
```

Equivalently, per-target package scripts: `pnpm --filter viewer run
cy:run:pages` (or `:workers` / `:preview` / `:graphs`).
