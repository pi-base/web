import { z } from 'zod'
import { Record } from './Record'

export const Space = z.intersection(
  Record,
  z.object({
    uid: z.string(),
    name: z.string(),
    aliases: z.optional(z.array(z.string())),
    ambiguous_construction: z.optional(z.boolean()),
  }),
)

export type Space = z.infer<typeof Space>
