import { z } from 'zod'
import { recordSchema } from './Record.js'
import { formulaSchema } from './Formula.js'

export const theoremSchema = z.intersection(
  z.object({
    when: formulaSchema(z.string()),
    then: formulaSchema(z.string()),
    converse: z.array(z.string()).optional().nullable()
  }),
  recordSchema
)

export type Theorem = z.infer<typeof theoremSchema>
