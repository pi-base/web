import { z } from 'zod'
import { Record } from './Record'

export const Space = z.intersection(
  Record,
  z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    ambiguous_construction: z.boolean(),
  }),
)

export type Space = z.infer<typeof Space>
