export default function externalLinks({ citation }: { citation?: string }) {
  if (!citation) {
    return
  }

  const [kind, id] = citation.split(':', 2)
  return format({ kind, id })
}

export function format({
  kind,
  id,
  name,
}: {
  kind: string
  id: string
  name?: string
}): { href: string; label: string } | undefined {
  switch (kind) {
    case 'doi':
      return { href: `https://doi.org/${id}`, label: name || `DOI ${id}` }
    case 'mr':
      return {
        href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
        label: name || `MR ${id}`,
      }
    case 'wikipedia':
      return {
        href: `https://en.wikipedia.org/wiki/${id}`,
        label: name || `Wikipedia ${id}`,
      }
    case 'mathse':
      return {
        href: `https://math.stackexchange.com/questions/${id}`,
        label: name || `Math StackExchange ${id}`,
      }
    case 'mo':
      return {
        href: `https://mathoverflow.net/questions/${id}`,
        label: name || `MathOverflow ${id}`,
      }
  }
}
