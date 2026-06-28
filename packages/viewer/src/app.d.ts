// See https://svelte.dev/docs/kit/types#app.d.ts
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'

declare global {
  namespace App {
    interface Platform {
      // `verifiedBotCategory` (Cloudflare's bot classification, which we read for telemetry)
      // isn't yet in the upstream `IncomingRequestCfProperties` type.
      cf?: IncomingRequestCfProperties & { verifiedBotCategory?: string }
    }
  }
}

export {}
