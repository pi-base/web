import { type Readable, get } from 'svelte/store'

type Halt = () => void

export function eachTick<T>(
  items: T[],
  handler: (item: T, halt: Halt) => void,
): Promise<void> {
  return new Promise(resolve => {
    let stop = false

    function halt() {
      stop = true
    }

    function go(i: number) {
      const item = items[i]
      if (stop || !item) {
        resolve()
        return
      }

      handler(item, halt)

      setTimeout(() => go(i + 1), 0)
    }

    go(0)
  })
}

// svelte's get allows for reading from polymorphic store types, but the
// polymorphism usually requires explicit type annotations. This version
// restricts types for more ergonomic usage for the common case.
export function read<T>(readable: Readable<T>): T {
  return get(readable)
}

export function subscribeUntil<S>(
  store: Readable<S>,
  condition: (state: S) => boolean,
): Promise<void> {
  return new Promise(resolve => {
    var unsubscribe = store.subscribe(state => {
      if (condition(state)) {
        resolve()
        unsubscribe && unsubscribe()
      }
    })
  })
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
