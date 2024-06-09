import { z } from 'zod'
import { Ref } from './Ref.js'
import { recordSchema } from './Record.js'
import { Formula, formulaSchema } from './Formula.js'

export const theoremSchema = z.intersection(
  z.object({
    when: formulaSchema(z.string()),
    then: formulaSchema(z.string()),
    converse: z.array(z.string()).optional().nullable(),
  }),
  recordSchema,
)

export type Theorem = z.infer<typeof theoremSchema>

// TODO: everything below this line was pushed down and should still be unified
export type SerializedTheorem = {
  id: number
  when: Formula<number>
  then: Formula<number>
  description: string
  refs: Ref[]
}