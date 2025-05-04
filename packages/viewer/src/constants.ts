const {
  VITE_BUNDLE_HOST = 'https://pub-65041ca69d744da88ade13abd31ad834.r2.dev', // TODO: push down to @pi-base/core?
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

export const contributingUrl = `https://github.com/orgs/pi-base/discussions/880`
export const helpUrl = `https://github.com/pi-base/data/wiki/`
export const sentryIngest =
  'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'

// Used for Fuse searches
export const searchWeights = {
  id: 3,
  name: 1,
  aliases: 0.7,
  description: 0.3,
}
export const searchKeys = [
  { name: 'id', weight: searchWeights.id, getFn: (s: any) => `${s.id}` },
  { name: 'name', weight: searchWeights.name },
  { name: 'aliases', weight: searchWeights.aliases },
  { name: 'description', weight: searchWeights.description },
]
export const searchThreshold = 0.3
