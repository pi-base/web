import type { Readable } from 'svelte/store'
import type { Store } from '../stores'
import type * as Errors from '../errors'

export type Context = Store & {
  showDev: boolean
  errorHandler: Errors.Handler

  typeset: Readable<(str: string, truncated?: boolean) => Promise<string>>

  load<T, S>(
    store: Readable<S>,
    lookup: (state: S) => T | null,
    until?: Promise<unknown>,
  ): Promise<T>

  // Lifecycle hooks
  loaded(): Promise<void>
  checked(spaceId: string): Promise<void>
}
