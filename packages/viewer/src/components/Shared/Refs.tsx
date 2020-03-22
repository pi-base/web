import React from 'react'

import { Ref } from '@pi-base/core'

import { DOI, MR, Wiki } from './Citation'

function Item({ item }: { item: any }) {
  if (item.doi) {
    return <DOI id={item.doi} name={item.name} />
  } else if (item.mr) {
    return <MR id={item.mr} />
  } else if (item.wikipedia) {
    return <Wiki id={item.wikipedia} />
  } else {
    return null
  }
}

export default function Refs({ refs }: { refs: Ref[] }) {
  return (
    <ul>
      {refs.map((item: Ref, i: number) => <li key={i}><Item item={item} /></li>)}
    </ul>
  )
}
