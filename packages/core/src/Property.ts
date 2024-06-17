import { z } from 'zod'
import { recordSchema } from './Record.js'
import { refSchema } from './Ref.js'

export const propertyPageSchema = z.object({
  uid: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  counterexamples_id: z.number().nullable().optional(),
  refs: z.array(refSchema).optional(),
  description: z.string(),
})

export const propertySchema = z.intersection(
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
  }),
  recordSchema,
)

export type Property = z.infer<typeof propertySchema>
export type PropertyPage = z.infer<typeof propertyPageSchema>
