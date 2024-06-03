import { z } from 'zod'

const refSchema = z.object({ name: z.string() })

export const propertySchema = z.object({
  uid: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  counterexamples_id: z.number().nullable().optional(),
  refs: z.array(refSchema).optional(),
  description: z.string(),
})

export const spaceSchema = z.object({
  uid: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  counterexamples_id: z.number().nullable().optional(),
  refs: z.array(refSchema).optional(),
  description: z.string(),
})
