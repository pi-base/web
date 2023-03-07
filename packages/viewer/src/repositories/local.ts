import type { Readable } from 'svelte/store'

import type { Prestore } from '../stores'
import initial from './initial'

import { type Serializers, prestore } from './serializers'

export type Source<T> = {
  [K in keyof T]: Readable<T[K]>
}

export type Spec<T> = {
  serializers: Serializers<T>
  initial: T
}

export type Local<T> = {
  load(): T
  subscribe(source: Source<T>): void
}

function build<T extends Record<string, unknown>>(
  { serializers, initial }: Spec<T>,
  storage = localStorage,
  prefix = 'pi-base',
  timeout = 1000,
): Local<T> {
  /* Persisting changes to local storage needs to balance between
   * - convenience - ideally automatically
   * - consistency - if two different subscriptions update at the same time, we
   *   want to capture both changes (or neither, if there's an error)
   * - performance - writing to storage on e.g. every trait deduction would slow
   *   down the process considerably
   *
   * Normal usage for this application is to boot up, have a flurry of changes
   * while deduction runs, and then stay mostly static until there's a refresh.
   * The storage approach here aims to
   * - batch up the changes in memory in `queue`
   * - wait for activity to die down for `timeout` ms
   * - flush the changes to `storage`
   */
  const queue: Partial<T> = {}
  let timer: NodeJS.Timeout

  // Writes each queued change to storage
  function flush() {
    timer && clearInterval(timer)
    for (const key in queue) {
      set(key, queue[key] as T[keyof T])
      delete queue[key]
    }
  }

  // Adds changes to the queue and resets the time to the next flush
  function schedule(key: keyof T, value: T[typeof key]) {
    timer && clearInterval(timer)
    timer = setTimeout(flush, timeout)
    queue[key] = value
  }

  // Lookup a stored key, using the configured deserializer
  function get(key: keyof T): T[typeof key] | undefined {
    const item = storage.getItem(`${prefix}.${String(key)}`)
    return item ? serializers[key][1](item) : undefined
  }

  // Write a value to a key, using the configured serializer
  function set(key: keyof T, value: T[typeof key]) {
    storage.setItem(`${prefix}.${String(key)}`, serializers[key][0](value))
  }

  return {
    // Hydrate all persisted fields
    load() {
      const loaded = initial
      for (const key in initial) {
        loaded[key as keyof T] = get(key) || initial[key]
      }
      return loaded
    },

    // Listen for changes to each field, and schedule persisting the update
    subscribe(source) {
      for (const key in source) {
        source[key].subscribe(value => schedule(key, value))
      }
    },
  }
}

export const spec: Spec<Prestore> = {
  // TODO: it is possible that we're reading a value persisted by an earlier
  // code version's serializer. To prevent that case, the deserializers should
  // perform a runtime validation of the expected shape.
  // Question: if one of the fields fails to pass validations, should we still
  // do a partial load (and fallback on the default for only those fields), or
  // should it invalidate all stored fields?
  serializers: prestore,
  initial,
}

export default function create(specfication = spec) {
  return build<Prestore>(specfication)
}
