import { type Readable, writable } from 'svelte/store'
import { bundle } from '@pi-base/core'

import { mainBranch } from '../constants'
import { trace } from '../debug'
import type { Source } from '../types'

export type State = Source

export interface Store extends Readable<Source> {
  checkout(branch: string): void
  setHost(host: string): void
}

export const initial: Source = {
  branch: mainBranch,
  host: bundle.defaultHost,
}

export function create(source?: Source): Store {
  const store = writable<Source>(source || initial)

  const { subscribe, update } = store

  return {
    subscribe,

    checkout(branch: string) {
      update(current => {
        if (branch !== current.branch) {
          trace({ event: 'checkout', branch })
          return { ...current, branch }
        } else {
          return current
        }
      })
    },

    setHost(host: string) {
      update(current => {
        if (host !== current.host) {
          trace({ event: 'set_host', host })
          return { host, branch: mainBranch }
        } else {
          return current
        }
      })
    },
  }
}
