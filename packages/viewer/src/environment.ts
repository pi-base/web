export type Environment = 'production' | 'deploy-preview' | 'dev'

export function forHost(host: string): Environment {
  if (['topology.pi-base.org', 'topology.pages.dev'].includes(host)) {
    return 'production'
  }

  if (host.includes('pages.dev')) {
    return 'deploy-preview'
  }

  return 'dev'
}
