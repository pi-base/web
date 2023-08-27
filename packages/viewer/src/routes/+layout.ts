import * as errors from '../errors'
import type { LayoutLoad } from './$types'
import { initialize } from '../context'
import { sync } from '../gateway'

export const load: LayoutLoad = async ({ fetch, url: { host } }) => {
  const dev = host.match(/(dev(elopment)?[.-]|localhost)/) !== null
  const errorEnv = ['topology.pi-base.org', 'topology.pages.dev'].includes(host)
    ? 'production'
    : host.includes('pages.dev')
    ? 'deploy-preview'
    : 'dev'

  const errorHandler = dev
    ? errors.log()
    : errors.sentry(
        'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960',
        errorEnv,
      )

  const context = initialize({
    showDev: dev,
    errorHandler,
    gateway: sync(fetch),
  })

  await context.loaded()

  return context
}
