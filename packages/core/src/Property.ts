import { z } from 'zod'
import { Record } from './Record'

export const Property = z.intersection(
  Record,
  z.object({
    uid: z.string(),
    name: z.string(),
    aliases: z.optional(z.array(z.string())),
  }),
)

export type Property = z.infer<typeof Property>
