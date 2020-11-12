export { default as list } from './list'
export { default as search } from './search'

import { Readable, Writable, get, writable } from 'svelte/store'
import {
  Collection,
  Property,
  SerializedTheorem,
  Space,
  Theorems,
  Trait,
  Traits,
} from '../models'
import * as Deduction from './deduction'
import * as Source from './source'
import * as Sync from './sync'
import type * as Gateway from '../gateway'
import { read } from '../util'

export type Meta = {
  etag?: string
  sha?: string
}

export type Prestore = {
  properties: Property[]
  spaces: Space[]
  theorems: SerializedTheorem[]
  traits: Trait[]
  source: Source.State
  sync: Sync.State<Meta> | undefined
  deduction: Deduction.State
}

export type Store = {
  properties: Readable<Collection<Property>>
  spaces: Readable<Collection<Space>>
  theorems: Readable<Theorems>
  traits: Readable<Traits>
  source: Source.Store
  sync: Sync.Store<Meta>
  deduction: Deduction.Store
}

export function create(pre: Prestore, gateway: Gateway.Sync): Store {
  const spaces = writable(Collection.empty<Space>())
  const properties = writable(Collection.empty<Property>())
  const theorems = writable(new Theorems())
  const traits = writable(new Traits())
  const source = Source.create()
  const sync = Sync.create(refresh)
  const deduction = Deduction.create(spaces, traits, theorems, (added) =>
    traits.update(($traits) => $traits.add(added)),
  )

  function set(
    ps: Property[],
    ss: Space[],
    is: SerializedTheorem[],
    ts: Trait[],
  ) {
    const si = Collection.byId(ss)
    const pi = Collection.byId(ps)

    spaces.set(si)
    properties.set(pi)
    theorems.set(Theorems.build(is, pi))
    traits.set(Traits.build(ts, si, pi))
  }

  async function refresh(): Promise<Meta> {
    const { host, branch } = get(source)
    const current = read(Sync.state<Meta>(sync))

    const result = await gateway(host, branch, current?.etag)
    if (result) {
      set(result.properties, result.spaces, result.theorems, result.traits)

      return {
        etag: result.etag,
        sha: result.sha,
      }
    } else {
      return { etag: current?.etag, sha: current?.sha }
    }
  }

  set(pre.properties, pre.spaces, pre.theorems, pre.traits)

  // FIXME: double-sync
  if (!pre.sync) {
    sync.sync()
  }

  let previousSource: Source.State
  source.subscribe((s) => {
    // Re-sync on source _change_, but not initial subscription
    if (
      previousSource &&
      (previousSource.branch !== s.branch || previousSource.host !== s.host)
    ) {
      set([], [], [], [])
      sync.sync()
    }
    previousSource = s
  })

  return {
    properties: mask(properties),
    spaces: mask(spaces),
    theorems: mask(theorems),
    traits: mask(traits),
    source,
    sync,
    deduction,
  }
}

function mask<T, S extends Writable<T>>(store: S) {
  const { set, update, ...rest } = store
  return rest
}
