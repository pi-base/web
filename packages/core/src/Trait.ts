import { z } from 'zod'
import { Id as BaseId } from './Id.js'
import { Record, recordSchema } from './Record.js'

export const proofSchema = <Id>(id: z.ZodSchema<Id>): z.ZodSchema<Proof<Id>> =>
  z.object({
    theorems: z.array(id),
    properties: z.array(id),
  })

export type Proof<Id = BaseId> = {
  theorems: Id[]
  properties: Id[]
}

export const traitSchema = <Id>(id: z.ZodSchema<Id>): z.ZodSchema<Trait<Id>> =>
  z.intersection(
    z.object({
      space: id,
      property: id,
      value: z.boolean(),
      proof: proofSchema(id).optional(),
    }),
    recordSchema,
  ) as any

export type Trait<Id = BaseId> = Record & {
  space: Id
  property: Id
  value: boolean
  proof?: Proof<Id>
}
