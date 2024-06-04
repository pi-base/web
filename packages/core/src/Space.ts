import { z } from 'zod'
import { recordSchema } from './Record.js'
import { refSchema } from './Ref.js'

export const spacePageSchema = z.object({
  uid: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  counterexamples_id: z.number().nullable().optional(),
  refs: z.array(refSchema).optional(),
  description: z.string(),
})

export const spaceSchema = z.intersection(
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    ambiguous_construction: z.boolean().optional(),
  }),
  recordSchema,
)

export type Space = z.infer<typeof spaceSchema>
export type SpacePage = z.infer<typeof spacePageSchema>
