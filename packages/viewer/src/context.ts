export type { Context } from './context/types'

import { getContext, setContext } from 'svelte'
import { Readable, derived } from 'svelte/store'
import * as F from '@pi-base/core/lib/Formula'

import type { Context } from './context/types'
import { trace } from './debug'
import * as Gateway from './gateway'
import { Id } from './models'
import { local } from './repositories'
import { Store, create } from './stores'
import * as Typeset from './stores/typeset'
import { subscribeUntil } from './util'

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

  function loaded() {
    return subscribeUntil(
      store.sync,
      (state) => state.kind === 'fetched' || state.kind === 'error',
    )
  }

  function load<T, S>(
    s: Readable<S>,
    lookup: (state: S) => T | null,
    until: Promise<unknown> = loaded(),
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const unsubscribe = s.subscribe((state) => {
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

  function checked(spaceId: string) {
    return store.deduction.checked(Id.toInt(spaceId))
  }

  return {
    ...store,
    typeset,
    loaded,
    load,
    checked,
  }
}

const contextKey = {}

export function set(value: Context) {
  setContext<Context>(contextKey, value)
}

export default function context() {
  return getContext<Context>(contextKey)
}