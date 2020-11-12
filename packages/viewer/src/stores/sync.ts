import { Readable, derived, writable } from 'svelte/store'

export type State<T> = (
  | { kind: 'fetching' }
  | { kind: 'fetched'; value: T }
  | { kind: 'error'; error: Error }
) & { at: Date }

export type Store<T> = Readable<State<T>> & {
  sync(): Promise<void>
}

export function initial<T>(): State<T> {
  return { kind: 'fetching', at: new Date() }
}

export function state<T>(store: Store<T>): Readable<T | undefined> {
  return derived(store, (state) =>
    state.kind === 'fetched' ? state.value : undefined,
  )
}

export function create<T>(
  run: () => Promise<T>,
  initial?: { value: T; at: Date },
): Store<T> {
  const state: State<T> = initial
    ? { kind: 'fetched', ...initial }
    : { kind: 'fetching', at: new Date() }

  const store = writable<State<T>>(state)

  async function sync() {
    store.set({ kind: 'fetching', at: new Date() })
    try {
      const value = await run()
      store.set({ kind: 'fetched', value, at: new Date() })
    } catch (error) {
      console.error(error)
      store.set({ kind: 'error', error, at: new Date() })
    }
  }

  return { subscribe: store.subscribe, sync }
}
