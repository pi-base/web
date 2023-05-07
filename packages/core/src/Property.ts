import { z } from 'zod'
import { recordSchema } from './Record.js'

export const propertySchema = z.intersection(
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
  }),
  recordSchema,
)

export type Property = z.infer<typeof propertySchema>
