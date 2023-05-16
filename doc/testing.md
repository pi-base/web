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

## Remote End-to-End Testing

There is a `./bin/e2e` script to facilitate running the end-to-end test suite
against a few common external URLs:

```bash
# Run tests against the deployed production URL
<root> $ ./bin/e2e production

# Run tests against a Cloudflare Pages preview URL for a named branch
<root> $ ./bin/e2e <branch>

# Run tests against a Cloudflare Pages preview URL for the current branch
<root> $ ./bin/e2e
```
