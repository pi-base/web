import { z } from 'zod'

// Ref describes the structure of existing bundled data
export const refSchema = z.intersection(
  // TODO: name presumably shouldn't be optional, but T000216 needs to be fixed
  z.object({ name: z.string().optional() }),
  z.union([
    z.object({ doi: z.string() }),
    z.object({ wikipedia: z.string() }),
    z.object({ mr: z.string() }),
    z.object({ mathse: z.number() }),
    z.object({ mo: z.number() }),
  ])
)
export type Ref = z.infer<typeof refSchema>

// TaggedRef is intended to be easier to operate (switch) on
export type TaggedRef =
  | { kind: 'doi'; id: string; name?: string }
  | { kind: 'wikipedia'; id: string; name?: string }
  | { kind: 'mr'; id: string; name?: string }
  | { kind: 'mathse'; id: string; name?: string }
  | { kind: 'mo'; id: string; name?: string }

export function tag(ref: Ref): TaggedRef {
  const { name } = ref

  if ('doi' in ref) {
    return { kind: 'doi', id: ref.doi, name }
  } else if ('wikipedia' in ref) {
    return { kind: 'wikipedia', id: ref.wikipedia, name }
  } else if ('mr' in ref) {
    return { kind: 'mr', id: ref.mr, name }
  } else if ('mathse' in ref) {
    return { kind: 'mathse', id: String(ref.mathse), name }
  } else {
    return { kind: 'mo', id: String(ref.mo), name }
  }
}
