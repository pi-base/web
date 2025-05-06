import { defineConfig } from 'cypress'
import { execSync } from 'child_process'

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch (error) {
    throw new Error(`Could not determine current git branch: ${error}`)
  }
}

function baseUrl({ CYPRESS_ENV = 'local' } = process.env) {
  switch (CYPRESS_ENV) {
    case 'local':
      return 'http://localhost:5173'
    case 'production':
      return 'https://topology.pi-base.org'
    case 'preview':
      const branch = process.env.BRANCH || getCurrentBranch()
      const domain = branch.toLowerCase().replaceAll('/', '-').slice(0, 28)
      return `https://${domain}.topology.pages.dev`
    default:
      throw new Error(`Invalid environment: ${CYPRESS_ENV}`)
  }
}

export default defineConfig({
  projectId: 'bkb3p8',
  chromeWebSecurity: false,
  e2e: {
    baseUrl: baseUrl(),
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: false,
  },
})
