import { initialize } from '@/context'
import { defaultHost } from '@/constants'
import * as errors from '@/errors'
import { sync } from '@/gateway'
import type { LayoutLoad } from './$types'
import { browser } from '$app/environment'

import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'

export const load: LayoutLoad = async ({ fetch, url: { host } }) => {
  const dev = host.match(/(dev(elopment)?[.-]|localhost)/) !== null

  if (browser) {
    const configDefaults = {
      ignoreNetworkEvents: true,
    }

    const sdk = new HoneycombWebSDK({
      debug: dev,
      apiKey: 'Sx608N12wwH9ZJ6qmHMVnA',
      serviceName: 'π-base web',
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-xml-http-request': configDefaults,
          '@opentelemetry/instrumentation-fetch': configDefaults,
          '@opentelemetry/instrumentation-document-load': configDefaults,
        }),
      ],
    })
    sdk.start()
  }

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
