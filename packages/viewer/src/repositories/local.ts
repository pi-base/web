import type { Readable } from 'svelte/store'

import type { Ref, Trait } from '../models'
import type { Prestore } from '../stores'
import * as Deduction from '../stores/deduction'
import * as Src from '../stores/source'

type Serializer<T> = [
  (value: T) => string, // serializer
  (string: string) => T | undefined, // deserializer; should be inverse to the serializer
]

type Serializers<T> = {
  [K in keyof T]: Serializer<T[K]>
}

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
    const item = storage.getItem(`${prefix}.${key}`)
    return item ? serializers[key][1](item) : undefined
  }

  // Write a value to a key, using the configured serializer
  function set(key: keyof T, value: T[typeof key]) {
    storage.setItem(`${prefix}.${key}`, serializers[key][0](value))
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
        source[key].subscribe((value) => schedule(key, value))
      }
    },
  }
}

// This type lies, as JSON.parse(JSON.stringify(m)) !== m for non-primitive types
// Use with caution
function json<T>(): Serializer<T> {
  return [JSON.stringify, JSON.parse]
}

// Traits take a up a _lot_ of space in storage, so we use a compressed encoding
type TraitRow =
  | [1, number, number, boolean, string, Ref[]]
  | [0, number, number, boolean, number[], number[]]

const traits: Serializer<Trait[]> = [
  (values) =>
    JSON.stringify(
      values.map((t) => {
        if (t.asserted) {
          return [1, t.space, t.property, t.value, t.description, t.refs]
        } else {
          return [
            0,
            t.space,
            t.property,
            t.value,
            t.proof.properties,
            t.proof.theorems,
          ]
        }
      }),
    ),
  (str) => {
    const traits: Trait[] = []

    if (!str) {
      return traits
    }

    JSON.parse(str).forEach((row: TraitRow) => {
      if (row[0] === 1) {
        const [_, space, property, value, description, refs] = row
        traits.push({
          asserted: true,
          space,
          property,
          value,
          description,
          refs,
        })
      } else if (row[0] === 0) {
        const [_, space, property, value, properties, theorems] = row
        traits.push({
          asserted: false,
          space,
          property,
          value,
          proof: {
            properties,
            theorems,
          },
        })
      }
    })

    return traits
  },
]

export const spec: Spec<Prestore> = {
  // TODO: it is possible that we're reading a value persisted by an earlier
  // code version's serializer. To prevent that case, the deserializers should
  // perform a runtime validation of the expected shape.
  // Question: if one of the fields fails to pass validations, should we still
  // do a partial load (and fallback on the default for only those fields), or
  // should it invalidate all stored fields?
  serializers: {
    properties: json(),
    spaces: json(),
    theorems: json(),
    traits: traits,
    source: json(),
    sync: json(),
    deduction: json(),
  },
  initial: {
    properties: [],
    spaces: [],
    theorems: [],
    traits: [],
    source: Src.initial,
    sync: undefined,
    deduction: Deduction.initial,
  },
}

export default function create() {
  return build<Prestore>(spec)
}
