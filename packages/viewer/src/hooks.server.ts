import type { Handle } from '@sveltejs/kit'

import { isolateCold, serverLog } from '@/debug'

// See https://kit.svelte.dev/docs/hooks#server-hooks
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    // We use the `etag` header from S3 to determine whether the bundle has
    // changed (and deduction needs to be re-run), so we need to preserve it.
    filterSerializedResponseHeaders(name, _value) {
      return name === 'etag'
    },
  })

  // Only SSR/endpoint requests reach this hook — static assets are served by the
  // Workers assets layer without invoking the Worker. Logging the route pattern,
  // isolate cold flag, and Cloudflare's verified bot category here lets us slice
  // the platform's per-invocation cpuTimeMs/wallTimeMs (joined by requestId) by
  // page, by cold vs warm isolate, and by human vs crawler.
  serverLog({
    evt: 'request',
    routeId: event.route.id,
    method: event.request.method,
    status: response.status,
    cold: isolateCold(),
    botCategory: event.platform?.cf?.verifiedBotCategory ?? null,
  })

  return response
}
