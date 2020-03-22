import React from 'react'

interface Props {
  id: string
  name?: string
}

export function DOI({ id, name }: Props) {
  return (
    <a href={`https://doi.org/${id}`}>
      {name || `DOI ${id}`}
    </a>
  )
}

export function MR({ id, name }: Props) {
  return (
    <a href={`https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`}>
      {name || `MR ${id}`}
    </a>
  )
}

export function Wiki({ id, name }: Props) {
  return (
    <a href={`https://en.wikipedia.org/wiki/${id}`}>
      {name || `Wikipedia ${id}`}
    </a>
  )
}

export default function Citation({ citation }: { citation: string }) {
  const [kind, id] = citation.split(':', 2)

  switch (kind) {
    case 'doi':
      return (<DOI id={id} />)
    case 'mr':
      return (<MR id={id} />)
    case 'wikipedia':
      return (<Wiki id={id} />)
    default:
      return (<span>{citation}</span>)
  }
}
