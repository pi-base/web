import { initialize } from '@/context'
import { defaultHost } from '@/constants'
import * as errors from '@/errors'
import { sync } from '@/gateway'
import type { LayoutLoad } from './$types'
import { browser } from '$app/environment'
import { initializeHoneycomb } from '@/honeycomb'
import { forHost } from '@/environment'

export const load: LayoutLoad = async ({ fetch, url: { host } }) => {
  const env = forHost(host)
  const dev = env === 'dev'

  if (browser) {
    initializeHoneycomb({ env })
  }

  const errorHandler = dev ? errors.log() : errors.sentry({ env })

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
