import { z } from 'zod'
import { Record } from './Record'

export const Property = z.intersection(
  Record,
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
  }),
)

export type Property = z.infer<typeof Property>
