import { bundle } from '@pi-base/core'

import type { Data, Source } from './types'
import { trace } from './debug'

export async function sync(
  { host, branch }: Source,
  current?: Data,
): Promise<Data | undefined> {
  trace({ event: 'remote_fetch_started', host, branch })
  const result = await bundle.fetch({ host, branch, etag: current?.etag })

  if (result) {
    trace({ event: 'remote_fetch_complete', result })
    return {
      spaces: Array.from(result.bundle.spaces.values()),
      properties: Array.from(result.bundle.properties.values()),
      traits: Array.from(result.bundle.traits.values()),
      theorems: Array.from(result.bundle.theorems.values()),
      etag: result.etag,
      sha: result.bundle.version.sha,
    }
  } else if (current) {
    trace({ event: 'bundle_unchanged', etag: current.etag })
  }
}
