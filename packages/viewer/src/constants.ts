import { bundle } from '@pi-base/core'

const {
  VITE_BUNDLE_HOST = bundle.defaultHost,
  VITE_BUNDLE_SSE = 'false',
  VITE_BRANCH = 'unknown',
  VITE_MAIN_BRANCH = 'main',
  VITE_VERSION = 'unknown',
} = import.meta.env

export const mainBranch = VITE_MAIN_BRANCH
export const defaultHost = VITE_BUNDLE_HOST

export const build = {
  branch: VITE_BRANCH,
  version: VITE_VERSION,
}

export const bundleSse = VITE_BUNDLE_SSE === 'true'

export const contributingUrl = `https://github.com/pi-base/data/wiki/Contributing`
export const helpUrl = `https://github.com/pi-base/data/wiki/`
export const sentryIngest =
  'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'

export const searchThreshold = 0.3
