export type { Context } from './context/types'

import { getContext, setContext } from 'svelte'
import { type Readable, derived } from 'svelte/store'
import { formula as F } from '@pi-base/core'

import type { Context } from './context/types'
import { trace } from './debug'
import * as Errors from './errors'
import type * as Gateway from './gateway'
import { Id } from './models'
import { renderer } from './parser'
import { type Local, local } from './repositories'
import { type Prestore, type Store, create } from './stores'
import { subscribeUntil } from './util'

export type Config = {
  showDevLink: boolean
}

// TODO: it seems like this shouldn't be necessary. Should the store more closely
// match the prestore (i.e. Readable<Theorem[]> instead of Readable<Theorems>)?
function project(store: Store) {
  return {
    ...store,
    properties: derived(store.properties, p => p.all),
    spaces: derived(store.spaces, s => s.all),
    theorems: derived(store.theorems, ts =>
      ts.all.map(t => ({
        ...t,
        when: F.mapProperty(p => p.id, t.when),
        then: F.mapProperty(p => p.id, t.then),
      })),
    ),
    traits: derived(store.traits, t => t.all),
  }
}

export function initialize({
  db = local(),
  errorHandler = Errors.log(),
  host,
  gateway,
  showDev = false,
  typesetter = renderer,
}: {
  db?: Local<Prestore>
  errorHandler?: Errors.Handler
  host?: string
  gateway: Gateway.Sync
  showDev?: boolean
  typesetter?: typeof renderer
}): Context {
  const pre = db.load()
  const store = create(pre, gateway, { host })

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
      state => state.kind === 'fetched' || state.kind === 'error',
    )
  }

  function load<T, S>(
    s: Readable<S>,
    lookup: (state: S) => T | null,
    until: Promise<unknown> = loaded(),
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      var unsubscribe = s.subscribe(state => {
        const found = lookup(state)
        if (found) {
          resolve(found)
          unsubscribe && unsubscribe()
        }
      })

      until.then(() => {
        reject()
        unsubscribe && unsubscribe()
      })
    })
  }

  function checked(spaceId: string) {
    return store.deduction.checked(Id.toInt(spaceId))
  }

  return {
    ...store,
    showDev,
    errorHandler,
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
