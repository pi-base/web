import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'bkb3p8',
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: false,
  },
})
