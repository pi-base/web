import type { Readable } from 'svelte/store'
import type { Store } from '../stores'

export type Context = Store & {
  typeset: Readable<(str: string, truncated?: boolean) => Promise<string>>

  load<T, S>(
    store: Readable<S>,
    lookup: (state: S) => T | null,
    until: Promise<unknown>,
  ): Promise<T>

  // Lifecycle hooks
  loaded(): Promise<void>
}
