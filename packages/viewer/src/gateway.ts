import { bundle } from '@pi-base/core'

import type { Data, Source } from './models'
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
      spaces: [...result.bundle.spaces.values()],
      properties: [...result.bundle.properties.values()],
      traits: [...result.bundle.traits.values()],
      theorems: [...result.bundle.theorems.values()],
      etag: result.etag,
      sha: result.bundle.version.sha,
    }
  } else if (current) {
    trace({ event: 'bundle_unchanged', etag: current.etag })
  }
}
