import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '7u7evp',
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: false,
  },
})
