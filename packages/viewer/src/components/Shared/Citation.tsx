import React from 'react'

import { Ref, TaggedRef } from '@pi-base/core'
import { tag } from '@pi-base/core/lib/Ref'

interface Props {
  id: string
  name?: string
}

function DOI({ id, name }: Props) {
  return (
    <a href={`https://doi.org/${id}`}>
      {name || `DOI ${id}`}
    </a>
  )
}

function MR({ id, name }: Props) {
  return (
    <a href={`https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`}>
      {name || `MR ${id}`}
    </a>
  )
}

function Wiki({ id, name }: Props) {
  return (
    <a href={`https://en.wikipedia.org/wiki/${id}`}>
      {name || `Wikipedia ${id}`}
    </a>
  )
}

function MathSE({ id, name }: Props) {
  return (
    <a href={`https://math.stackexchange.com/questions/${id}`}>
      {name || `Math StackExchange ${id}`}
    </a>
  )
}

function MO({ id, name }: Props) {
  return (
    <a href={`https://mathoverflow.net/questions/${id}`}>
      {name || `MathOverflow ${id}`}
    </a>
  )
}

export function Reference({ ref: { kind, id, name } }: { ref: TaggedRef }) {
  switch (kind) {
    case 'doi':
      return (<DOI id={id} name={name} />)
    case 'mr':
      return (<MR id={id} name={name} />)
    case 'wikipedia':
      return (<Wiki id={id} name={name} />)
    case 'mathse':
      return (<MathSE id={id} name={name} />)
    case 'mo':
      return (<MO id={id} name={name} />)
    default:
      return (<span>`${kind} ${id} ${name}</span>)
  }
}

export default function Citation({ citation }: { citation: string }) {
  const [kind, id] = citation.split(':', 2)
  const ref = { kind, id } as TaggedRef

  return (
    <Reference ref={ref} />
  )
}
