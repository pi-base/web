import { z } from 'zod'
import { Id as BaseId } from './Id'
import { Record } from './Record'

export type Proof<Id = BaseId> = {
  theorems: Id[]
  properties: Id[]
}

export type Trait<Id = BaseId> = Record & {
  space: Id
  property: Id
  value: boolean
  proof?: Proof<Id>
}

export const Trait = z.intersection(
  Record,
  z.object({
    space: z.string(),
    property: z.string(),
    value: z.boolean(),
    proof: z.optional(
      z.object({
        theorems: z.array(z.string()),
        properties: z.array(z.string()),
      }),
    ),
  }),
)
