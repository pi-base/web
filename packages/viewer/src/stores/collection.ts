import { Readable, derived } from 'svelte/store'

export type Collection<V, K = number> = {
  all: V[]
  find(id: K): V | null
}

export function index<V, K = number>(
  items: V[],
  key: (item: V) => K,
): Collection<V, K> {
  const index = new Map(items.map((item) => [key(item), item]))

  return {
    get all() {
      return Array.from(index.values())
    },
    find(id: K) {
      return index.get(id) || null
    },
  }
}

export function collect<S, T extends { uid: string }>(
  remote: Readable<S | undefined>,
  project: (data: S) => T[],
): Readable<Collection<T>> {
  return derived(remote, ($remote) =>
    index($remote ? project($remote) : [], (record) =>
      parseInt(record.uid.slice(1)),
    ),
  )
}
