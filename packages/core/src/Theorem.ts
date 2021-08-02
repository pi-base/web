import { z } from 'zod'
import { Record } from './Record'
import { Formula } from './Formula'

const Formula: z.ZodSchema<Formula<string>> = z.lazy(() =>
  z.union([
    z.object({
      kind: z.literal('atom'),
      property: z.string(),
      value: z.boolean(),
    }),
    z.object({ kind: z.literal('and'), subs: z.array(Formula) }),
    z.object({ kind: z.literal('or'), subs: z.array(Formula) }),
  ]),
)

export const Theorem = z.intersection(
  Record,
  z.object({
    when: Formula,
    then: Formula,
    converse: z.optional(z.array(z.string())),
  }),
)

export type Theorem = z.infer<typeof Theorem>
