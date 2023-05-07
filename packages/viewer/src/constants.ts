export const mainBranch = 'main'
export const contributingUrl = `https://github.com/pi-base/data/blob/${mainBranch}/CONTRIBUTING.md`

export const build = {
  branch: import.meta.env.VITE_BRANCH || 'unknown',
  version: import.meta.env.VITE_VERSION || 'unknown',
}
