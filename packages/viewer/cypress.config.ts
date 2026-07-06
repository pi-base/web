import { defineConfig } from 'cypress'

// The account's workers.dev subdomain for the viewer Workers (see
// doc/deployment.md). Used to address the deployed Workers directly.
const WORKERS_SUBDOMAIN = 'pi-base.workers.dev'

type Mode = 'fixture' | 'live'
type Target = { baseUrl: string; mode: Mode }

// `CYPRESS_ENV` selects which deployment to test and, with it, the data source:
//
//   fixture — intercept the data bundle with cypress/fixtures/main.min.json for
//             deterministic, hermetic runs (local dev + CI).
//   live    — hit the deployment's real R2 bundle end-to-end, to confirm the
//             actual sites render real data and stay consistent across Pages /
//             Workers / previews.
//
// `CYPRESS_MODE` can override the data source for a target (e.g. run a deployed
// URL against the fixture while debugging).
function targetFor(name: string): Target {
  switch (name) {
    case 'local':
      return { baseUrl: 'http://localhost:5173', mode: 'fixture' }
    case 'pages':
    case 'production': // back-compat alias for the legacy Pages site
      return { baseUrl: 'https://topology.pi-base.org', mode: 'live' }
    case 'workers':
      return {
        baseUrl: `https://topology.${WORKERS_SUBDOMAIN}`,
        mode: 'live',
      }
    case 'graphs':
      return {
        baseUrl: `https://graphs.${WORKERS_SUBDOMAIN}`,
        mode: 'live',
      }
    case 'preview': {
      // Workers preview URLs (`wrangler versions upload`) are per-version, not
      // per-branch, so they can't be derived — pass the printed URL explicitly.
      const url = process.env.PREVIEW_URL
      if (!url) {
        throw new Error(
          'CYPRESS_ENV=preview requires PREVIEW_URL — the per-version URL from ' +
            "`wrangler versions upload` (or the PR's Workers Builds preview).",
        )
      }
      return { baseUrl: url, mode: 'live' }
    }
    default:
      throw new Error(`Invalid CYPRESS_ENV: ${name}`)
  }
}

function resolveTarget(
  { CYPRESS_ENV = 'local', CYPRESS_MODE } = process.env,
): Target {
  const target = targetFor(CYPRESS_ENV)
  return { ...target, mode: (CYPRESS_MODE as Mode) || target.mode }
}

const target = resolveTarget()

export default defineConfig({
  projectId: 'bkb3p8',
  chromeWebSecurity: false,
  // Exposed to specs as `Cypress.env('mode')`; drives fixture vs. live data.
  env: { mode: target.mode },
  e2e: {
    baseUrl: target.baseUrl,
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: false,
    // Retry in CI/headless runs to absorb transient flake — network hiccups and
    // async deduction when pointed at a live (non-intercepted) deployment.
    retries: { runMode: 2, openMode: 0 },
  },
})
