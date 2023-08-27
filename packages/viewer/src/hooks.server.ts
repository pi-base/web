import type { Handle } from '@sveltejs/kit'

// See https://kit.svelte.dev/docs/hooks#server-hooks
export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    // We use the `etag` header from S3 to determine whether the bundle has
    // changed (and deduction needs to be re-run), so we need to preserve it.
    filterSerializedResponseHeaders(name, _value) {
      return name === 'etag'
    },
  })
}
