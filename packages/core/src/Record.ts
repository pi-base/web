import { z } from 'zod'
import { Ref } from './Ref'

export const Record = z.object({
  counterexamples_id: z.optional(z.union([z.number(), z.null()])),
  description: z.string(),
  refs: z.optional(z.array(Ref)),
})

export type Record = z.infer<typeof Record>
