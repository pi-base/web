export type { Context } from './context/types'

import { getContext, setContext } from 'svelte'
import { Readable, derived } from 'svelte/store'
import * as F from '@pi-base/core/lib/Formula'

import type { Context } from './context/types'
import { trace } from './debug'
import * as Gateway from './gateway'
import { local } from './repositories'
import { Store, create } from './stores'
import * as Typeset from './stores/typeset'

// TODO: it seems like this shouldn't be necessary. Should the store more closely
// match the prestore (i.e. Readable<Theorem[]> instead of Readable<Theorems>)?
function project(store: Store) {
  return {
    ...store,
    properties: derived(store.properties, (p) => p.all),
    spaces: derived(store.spaces, (s) => s.all),
    theorems: derived(store.theorems, (ts) =>
      ts.all.map((t) => ({
        ...t,
        when: F.mapProperty((p) => p.id, t.when),
        then: F.mapProperty((p) => p.id, t.then),
      })),
    ),
    traits: derived(store.traits, (t) => t.all),
  }
}

export function initialize(
  db = local(),
  gateway = Gateway.sync,
  typesetter = Typeset.typesetter,
): Context {
  const pre = db.load()
  const store = create(pre, gateway)

  db.subscribe(project(store))

  if (!pre.sync) {
    store.sync.sync()
  }

  const typeset = derived(
    [store.properties, store.spaces, store.theorems],
    ([properties, spaces, theorems]) => {
      trace({ event: 'build_typesetter' })
      return typesetter(properties, spaces, theorems)
    },
  )

  function load<T, S>(
    store: Readable<S>,
    lookup: (state: S) => T | null,
    until: Promise<unknown>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const unsubscribe = store.subscribe((state) => {
        const found = lookup(state)
        if (found) {
          resolve(found)
          unsubscribe()
        }
      })

      until.then(() => {
        reject()
        unsubscribe()
      })
    })
  }

  function loaded(): Promise<void> {
    return new Promise((resolve) => {
      const unsubscribe = store.sync.subscribe((state) => {
        if (state.kind === 'fetched' || state.kind === 'error') {
          resolve()
          unsubscribe()
        }
      })
    })
  }

  return {
    ...store,
    typeset,
    load,
    loaded,
  }
}

const contextKey = {}

export function set(value: Context) {
  setContext<Context>(contextKey, value)
}

export default function context() {
  return getContext<Context>(contextKey)
}
