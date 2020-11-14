import { getContext, setContext } from 'svelte'
import { Readable, derived } from 'svelte/store'
import * as F from '@pi-base/core/lib/Formula'

import { trace } from './debug'
import * as Gateway from './gateway'
import local from './repositories/local'
import { Store, create } from './stores'
import * as Typeset from './stores/typeset'

export type Context = Store & {
  typeset: Readable<(str: string, truncated?: boolean) => Promise<string>>
}

const contextKey = {}

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

  return { ...store, typeset }
}

export function set(value: Context) {
  setContext<Context>(contextKey, value)
}

export default function context() {
  return getContext<Context>(contextKey)
}
