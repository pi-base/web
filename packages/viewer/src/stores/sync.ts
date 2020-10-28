import { Readable, writable } from 'svelte/store'

export type State = (
  | { kind: 'fetching' }
  | { kind: 'fetched' }
  | { kind: 'error'; error: Error }
) & { at: Date }

export type Store = Readable<State> & {
  sync(): Promise<void>
}

export function create(
  previous: Date | undefined,
  run: () => Promise<void>,
): Store {
  const initial: State = previous
    ? { kind: 'fetched', at: previous }
    : { kind: 'fetching', at: new Date() }

  const { set, subscribe } = writable<State>(initial)

  async function sync() {
    set({ kind: 'fetching', at: new Date() })
    try {
      await run()
      set({ kind: 'fetched', at: new Date() })
    } catch (error) {
      set({ kind: 'error', error, at: new Date() })
    }
  }

  return { subscribe, sync }
}
