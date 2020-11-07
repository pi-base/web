import { Readable, get } from 'svelte/store'

type Halt = () => void

export function eachTick<T>(
  items: T[],
  handler: (item: T, index: number, halt: Halt) => void,
): Halt {
  let timeout: NodeJS.Timeout

  function halt() {
    timeout && clearTimeout(timeout)
  }

  function go(i: number) {
    const item = items[i]
    if (!item) {
      return halt()
    }

    handler(item, i, halt)

    timeout = setTimeout(() => go(i + 1), 0)
  }

  go(0)

  return halt
}

// svelte's get allows for reading from polymorphic store types, but the
// polymorphism usually requires explicit type annotations. This version
// restricts types for more ergonomic usage for the common case.
export function read<T>(readable: Readable<T>): T {
  return get(readable)
}
