import { z } from 'zod'
import { recordSchema } from './Record.js'

export const spaceSchema = z.intersection(
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    ambiguous_construction: z.boolean().optional()
  }),
  recordSchema
)

export type Space = z.infer<typeof spaceSchema>
