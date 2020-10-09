// Ref describes the structure of existing bundled data
export type Ref = { name: string } & Kind
export type Kind
  = { doi: string }
  | { wikipedia: string }
  | { mr: string }
  | { mathse: string }
  | { mo: string }

// TaggedRef is intended to be easier to operate (switch) on
export type TaggedRef
  = { kind: 'doi', id: string, name?: string }
  | { kind: 'wikipedia', id: string, name?: string }
  | { kind: 'mr', id: string, name?: string }
  | { kind: 'mathse', id: string, name?: string }
  | { kind: 'mo', id: string, name?: string }

export function tag(ref: Ref): TaggedRef {
  const {
    doi,
    wikipedia,
    mr,
    mathse,
    mo,
    name
  } = ref as any

  if (doi) {
    return { kind: 'doi', id: doi, name }
  } else if (wikipedia) {
    return { kind: 'wikipedia', id: wikipedia, name }
  } else if (mr) {
    return { kind: 'mr', id: mr, name }
  } else if (mathse) {
    return { kind: 'mathse', id: mathse, name }
  } else {
    return { kind: 'mo', id: mo, name }
  }
}
