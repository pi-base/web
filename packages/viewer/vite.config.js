import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { readFileSync } from 'node:fs'

const pathExp = new RegExp('/refs/heads/(.*).json')

/** @type {import('vite').Plugin} */
const fixtures = {
  name: 'fixtures-middleware',
  // See https://kit.svelte.dev/docs/faq#how-do-i-use-x-with-sveltekit-how-do-i-use-middleware
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const match = pathExp.exec(req.url)
      if (match) {
        res.setHeader('Content-Type', 'application/json')

        const ref = match[1]
        const data = readFileSync(`./cypress/fixtures/${ref}.min.json`)
        return res.end(data)
      }

      next()
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit(), fixtures],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      lines: 80.01,
      branches: 87.97,
      statements: 80.01,
      functions: 81,
      skipFull: true,
      thresholdAutoUpdate: true,
    },
  },
})
