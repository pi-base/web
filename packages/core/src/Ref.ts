import { z } from 'zod'

// Ref describes the structure of existing bundled data
export const refSchema = z.intersection(
  z.object({ name: z.string() }),
  z.union([
    z.object({ doi: z.string() }),
    z.object({ wikipedia: z.string() }),
    z.object({ mr: z.string() }),
    z.object({ mr: z.number() }),
    z.object({ mathse: z.number() }),
    z.object({ mo: z.number() }),
    z.object({ zb: z.string() }),
  ]),
)
export type Ref = z.infer<typeof refSchema>

// TaggedRef is intended to be easier to operate (switch) on
export type TaggedRef =
  | { kind: 'doi'; id: string; name?: string }
  | { kind: 'wikipedia'; id: string; name?: string }
  | { kind: 'mr'; id: string; name?: string }
  | { kind: 'mathse'; id: string; name?: string }
  | { kind: 'mo'; id: string; name?: string }
  | { kind: 'zb'; id: string; name?: string }

export type Kind = TaggedRef['kind']

export function tag(ref: Ref): TaggedRef {
  const { name } = ref

  if ('doi' in ref) {
    return { kind: 'doi', id: ref.doi, name }
  } else if ('wikipedia' in ref) {
    return { kind: 'wikipedia', id: ref.wikipedia, name }
  } else if ('mr' in ref) {
    return { kind: 'mr', id: String(ref.mr), name }
  } else if ('mathse' in ref) {
    return { kind: 'mathse', id: String(ref.mathse), name }
  } else if ('mo' in ref) {
    return { kind: 'mo', id: String(ref.mo), name }
  } else {
    return { kind: 'zb', id: String(ref.zb), name }
  }
}

type FormatInput = { kind: Kind; id: string; name?: string } | Ref

export function format(input: FormatInput) {
  if ('kind' in input) {
    const { kind, id, name } = input
    switch (kind) {
      case 'doi':
        return { href: `https://doi.org/${id}`, title: name || `DOI ${id}` }
      case 'mr':
        return {
          href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
          title: name || `MR ${id}`,
        }
      case 'wikipedia':
        return {
          href: `https://en.wikipedia.org/wiki/${id}`,
          title: name || `Wikipedia ${id}`,
        }
      case 'mathse':
        return {
          href: `https://math.stackexchange.com/questions/${id}`,
          title: name || `Math StackExchange ${id}`,
        }
      case 'mo':
        return {
          href: `https://mathoverflow.net/questions/${id}`,
          title: name || `MathOverflow ${id}`,
        }
      case 'zb':
        return {
          href: `https://zbmath.org/${id}`,
          title: name || `zbMATH ${id}`,
        }
    }
  } else {
    return format(tag(input))
  }
}
