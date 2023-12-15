import { bundle } from '@pi-base/core'

export const mainBranch = 'main'
export const contributingUrl = `https://github.com/pi-base/data/wiki/Contributing`
export const defaultHost = bundle.defaultHost

export const build = {
  branch: import.meta.env.VITE_BRANCH || 'unknown',
  version: import.meta.env.VITE_VERSION || 'unknown',
}

export const sentryIngest =
  'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'
