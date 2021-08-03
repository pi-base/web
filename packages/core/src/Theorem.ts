import { z } from 'zod'
import { Record } from './Record'
import { Formula } from './Formula'

export const FormulaSchema: z.ZodSchema<Formula<string>> = z.lazy(() =>
  z.union([
    z.object({
      kind: z.literal('atom'),
      property: z.string(),
      value: z.boolean(),
    }),
    z.object({ kind: z.literal('and'), subs: z.array(FormulaSchema) }),
    z.object({ kind: z.literal('or'), subs: z.array(FormulaSchema) }),
  ]),
)

export const Theorem = z.intersection(
  Record,
  z.object({
    uid: z.string(),
    when: FormulaSchema,
    then: FormulaSchema,
    converse: z.optional(z.array(z.string())),
  }),
)

export type Theorem = z.infer<typeof Theorem>
