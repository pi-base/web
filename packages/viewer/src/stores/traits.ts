import { Readable, writable } from 'svelte/store'
import type { Data, Trait } from '../types'
import Traits from '../models/Traits'

export type Store = Readable<Traits> & {
  add(traits: Trait[]): void
}

export function create(data: Readable<Data | undefined>) {
  const traits = writable<Traits>(new Traits())

  data.subscribe(($data) => traits.set(Traits.fromData($data)))

  function add(assertions: Trait[]) {
    traits.update(($traits) => $traits.add(assertions))
  }

  return {
    subscribe: traits.subscribe,
    add,
  }
}
