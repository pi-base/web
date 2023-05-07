import { refSchema } from './Ref.js'
import { z } from 'zod'

export const recordSchema = z.object({
  uid: z.string(),
  counterexamples_id: z.number().optional().nullable(),
  description: z.string(),
  refs: z.array(refSchema),
})

export type Record = z.infer<typeof recordSchema>
