import { getContext, setContext } from 'svelte'
import { Readable, derived, get, writable } from 'svelte/store'

import type { Source } from './types'
import * as Gateway from './gateway'
import { Theorems, Traits } from './models'
import { ILocal, Local } from './repositories/local'
import { Collection, collect } from './stores/collection'
import * as Src from './stores/source'
import * as Sync from './stores/sync'
import type { Property, Space } from './types'

export type Context = {
  source: Src.Store
  sync: Sync.Store
  properties: Readable<Collection<Property, number | string>>
  spaces: Readable<Collection<Space, number | string>>
  theorems: Readable<Theorems>
  traits: Readable<Traits>
  sha: Readable<string | undefined>
}

const contextKey = {}

export function initialize(
  local: ILocal = new Local(),
  syncBuilder = Gateway.sync,
): Context {
  const source = Src.create(local.source)
  source.subscribe((s) => (local.source = s))

  const data = writable(local.data)
  data.subscribe((d) => (local.data = d))

  const sync = Sync.create(local.synced, () =>
    syncBuilder(get(source), get(data)).then(
      (result) => result && data.set(result),
    ),
  )
  sync.subscribe(({ kind, at }) => {
    if (kind === 'fetched') {
      local.synced = at
    }
  })

  // Sync on boot only if there is no data available locally
  if (!local.data) {
    sync.sync()
  }

  let previousSource: Source
  source.subscribe((s) => {
    // Re-sync on source _change_, but not initial subscription
    if (
      previousSource &&
      (previousSource.branch !== s.branch || previousSource.host !== s.host)
    ) {
      data.set(undefined)
      sync.sync()
    }
    previousSource = s
  })

  return {
    source,
    sync,
    properties: collect(data, (d) => d.properties),
    spaces: collect(data, (d) => d.spaces),
    theorems: derived(data, Theorems.fromData),
    traits: derived(data, Traits.fromData),
    sha: derived(data, (d) => d?.sha),
  }
}

export function set(value: Context) {
  setContext<Context>(contextKey, value)
}

export default function context() {
  return getContext<Context>(contextKey)
}

export function properties() {
  return context().properties
}

export function spaces() {
  return context().spaces
}

export function theorems() {
  return context().theorems
}

export function traits() {
  return context().traits
}
