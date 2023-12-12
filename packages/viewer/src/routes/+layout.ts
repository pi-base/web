import { initialize } from '@/context'
import { defaultHost } from '@/constants'
import * as errors from '@/errors'
import { sync } from '@/gateway'
import type { LayoutLoad } from './$types'

const bundleHost = import.meta.env.VITE_BUNDLE_HOST || defaultHost

export const load: LayoutLoad = async ({ fetch, url: { host }, route }) => {
  const dev = host.match(/(dev(elopment)?[.-]|localhost)/) !== null
  const errorEnv: errors.Environment = [
    'topology.pi-base.org',
    'topology.pages.dev',
  ].includes(host)
    ? 'production'
    : host.includes('pages.dev')
    ? 'deploy-preview'
    : 'dev'

  const errorHandler = dev
    ? errors.log()
    : errors.sentry({ environment: errorEnv })

  const context = initialize({
    showDev: dev,
    errorHandler,
    gateway: sync(fetch),
    source: {
      host: bundleHost,
    },
  })

  await context.loaded()

  return context
}
