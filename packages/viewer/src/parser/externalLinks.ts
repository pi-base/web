export default function externalLinks({ citation }: { citation?: string }) {
  if (!citation) {
    return
  }

  const [prefix, id] = citation.split(':', 2)
  switch (prefix) {
    case 'doi':
      return { href: `https://doi.org/${id}`, label: `DOI ${id}` }
    case 'mr':
      return {
        href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
        label: `MR ${id}`,
      }
    case 'wikipedia':
      return {
        href: `https://en.wikipedia.org/wiki/${id}`,
        label: `Wikipedia ${id}`,
      }
    case 'mathse':
      return {
        href: `https://math.stackexchange.com/questions/${id}`,
        label: `Math StackExchange ${id}`,
      }
    case 'mo':
      return {
        href: `https://mathoverflow.net/questions/${id}`,
        label: `MathOverflow ${id}`,
      }
  }
}
