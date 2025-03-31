import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'
import type { Environment } from '@/environment'

// These are frontend-embedded ingest-only keys that are safe to expose
const apiKeys: Record<Environment, string | null> = {
  'deploy-preview':
    'hcaik_01jqmng6xbp8wnh1fg2srx4cbpmbyk4kb7kq8ngm8stx5ynv4t1c4x0qm9',
  production:
    'hcaik_01jqmnfmeqprbx9x3vyr0rgj5sads64hnctxqkqcbp4bfhjf56s56dsszs',
  dev: null,
}

const configDefaults = {
  ignoreNetworkEvents: true,
}

export function initializeHoneycomb({ env }: { env: Environment }) {
  const apiKey = apiKeys[env]
  if (!apiKey) {
    return
  }

  const sdk = new HoneycombWebSDK({
    serviceName: 'π-base web',
    apiKey,
    debug: env !== 'production',
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
