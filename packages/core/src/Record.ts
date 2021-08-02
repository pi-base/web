import { z } from 'zod'
import { Ref } from './Ref'

export const Record = z.object({
  uid: z.string(),
  counterexamples_id: z.optional(z.string()),
  description: z.string(),
  refs: z.array(Ref),
})

export type Record = z.infer<typeof Record>
