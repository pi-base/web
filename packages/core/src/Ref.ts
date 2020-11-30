// Ref describes the structure of existing bundled data
export type Ref = { name: string } & Kind
export type Kind =
  | { doi: string }
  | { wikipedia: string }
  | { mr: string }
  | { mathse: string }
  | { mo: string }

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
    return { kind: 'mathse', id: ref.mathse, name }
  } else {
    return { kind: 'mo', id: ref.mo, name }
  }
}
