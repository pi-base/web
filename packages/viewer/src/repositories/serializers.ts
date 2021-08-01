import type { Ref, Trait } from '../models'
import type { Prestore } from '../stores'
import type { State as Deduction } from '../stores/deduction'

type Serializer<T> = [
  (value: T) => string, // serializer
  (string: string) => T | undefined, // deserializer; should be inverse to the serializer
]

export type Serializers<T> = {
  [K in keyof T]: Serializer<T[K]>
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

    // FIXME
    // eslint-disable-next-line
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

const deduction: Serializer<Deduction> = [
  (state: Deduction) =>
    JSON.stringify({
      ...state,
      checked: [...state.checked],
      all: [...state.all],
    }),
  (raw: string) => {
    // FIXME
    // eslint-disable-next-line
    const { checked, all, contradiction } = JSON.parse(raw)
    return {
      // FIXME
      // eslint-disable-next-line
      contradiction,
      checked: new Set(checked),
      all: new Set(all),
    }
  },
]

export const prestore: Serializers<Prestore> = {
  properties: json(),
  spaces: json(),
  theorems: json(),
  traits,
  source: json(),
  sync: json(),
  deduction,
}
