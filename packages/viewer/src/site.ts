// Per-deployment ("site") configuration, selected at build time via VITE_SITE.
//
// The viewer is built once per site (e.g. `VITE_SITE=graphs pnpm build`) and
// each build is deployed to its own Cloudflare Worker. For now the only
// difference is a branding label; this is the seam where data-bundle host,
// tagline, theme, etc. will diverge later.

type SiteKey = 'topology' | 'graphs'

type Site = {
  key: SiteKey
  label: string
}

const sites: Record<SiteKey, Site> = {
  topology: { key: 'topology', label: 'π-Base' },
  graphs: { key: 'graphs', label: 'π-Base (graphs)' },
}

const key = (import.meta.env.VITE_SITE ?? 'topology') as SiteKey

export const site = sites[key] ?? sites.topology
