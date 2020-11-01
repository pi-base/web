import { Readable, derived } from 'svelte/store'
import { idToInt } from '../util'

export type Collection<V, K = number> = {
  all: V[]
  find(id: K): V | null
}

export function indexByUid<T extends { uid: string }>(
  items: T[],
): Collection<T, number | string> {
  return index(
    items,
    (i) => idToInt(i.uid),
    (input: number | string) => {
      if (typeof input === 'string') {
        return idToInt(input)
      } else {
        return input
      }
    },
  )
}

// Key represents the internal index key
// Input represents the value passed to find
// By default they are the same, but this allow us to create a collection which
//   can look up a `number | string` union type
export function index<Value, Key, Input extends Key = Key>(
  items: Value[],
  key: (value: Value) => Key,
  normalize: (input: Input) => Key = (i) => i,
): Collection<Value, Input> {
  const index = new Map(items.map((item) => [key(item), item]))

  return {
    get all() {
      return Array.from(index.values())
    },
    find(id: Input) {
      return index.get(normalize(id)) || null
    },
  }
}

export function collect<S, T extends { uid: string }>(
  remote: Readable<S | undefined>,
  project: (data: S) => T[],
): Readable<Collection<T, string | number>> {
  return derived(remote, ($remote) =>
    indexByUid($remote ? project($remote) : []),
  )
}
