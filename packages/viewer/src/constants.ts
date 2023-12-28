import { bundle } from '@pi-base/core'
import { dev } from '$app/environment'
import * as envPublic from '$env/static/public'

export const mainBranch = 'main'
export const contributingUrl = `https://github.com/pi-base/data/wiki/Contributing`
let _defaultHost = bundle.defaultHost
try {
  _defaultHost = dev ? envPublic.PUBLIC_DATA_URL : bundle.defaultHost
} catch {}
export const defaultHost = _defaultHost

export const build = {
  branch: import.meta.env.VITE_BRANCH || 'unknown',
  version: import.meta.env.VITE_VERSION || 'unknown',
}

export const sentryIngest =
  'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'
