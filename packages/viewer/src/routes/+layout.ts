import { initialize } from '@/context'
import { defaultHost } from '@/constants'
import * as errors from '@/errors'
import { sync } from '@/gateway'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, url: { host } }) => {
  const dev = host.match(/(dev(elopment)?[.-]|localhost)/) !== null

  const errorHandler = dev
    ? errors.log()
    : errors.sentry({ environment: errorEnv(host) })

  const context = initialize({
    showDev: dev,
    errorHandler,
    gateway: sync(fetch),
    source: {
      host: defaultHost,
    },
  })

  await context.loaded()

  return context
}

function errorEnv(host: string): errors.Environment {
  if (['topology.pi-base.org', 'topology.pages.dev'].includes(host)) {
    return 'production'
  }

  if (host.includes('pages.dev')) {
    return 'deploy-preview'
  }

  return 'dev'
}
