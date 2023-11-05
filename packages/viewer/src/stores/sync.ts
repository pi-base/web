import { type Readable, derived, writable } from 'svelte/store'
import { read } from '@/util'

export type State<T> = (
  | { kind: 'initializing' }
  | { kind: 'fetching' }
  | { kind: 'fetched'; value: T }
  | { kind: 'error'; error: Error }
) & { at: Date }

export type Store<T> = Readable<State<T>> & {
  sync(): Promise<void>
}

export function initial<T>(): State<T> {
  return { kind: 'initializing', at: new Date() }
}

export function state<T>(store: Store<T>): Readable<T | undefined> {
  return derived(store, state =>
    state.kind === 'fetched' ? state.value : undefined,
  )
}

export function create<T>(
  run: () => Promise<T>,
  initialValue = initial<T>(),
): Store<T> {
  const store = writable<State<T>>(initialValue)

  async function sync() {
    if (read(store).kind === 'fetching') {
      return
    }

    store.set({ kind: 'fetching', at: new Date() })
    try {
      const value = await run()
      store.set({ kind: 'fetched', value, at: new Date() })
    } catch (error: any) {
      console.error(error)
      store.set({ kind: 'error', error, at: new Date() })
    }
  }

  return { subscribe: store.subscribe, sync }
}
