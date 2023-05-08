import type { Ref } from '@pi-base/core'

type ExternalLinkKind = Ref.TaggedRef['kind']

export function external([kind, id]: [ExternalLinkKind, string]) {
  return format({ kind, id })
}

export function format({
  kind,
  id,
  name,
}: {
  kind: ExternalLinkKind
  id: string
  name?: string
}) {
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
  }
}
