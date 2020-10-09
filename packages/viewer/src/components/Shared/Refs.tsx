import React from 'react'

import { Ref } from '@pi-base/core'
import { tag } from '@pi-base/core/lib/Ref'

import { Reference } from './Citation'

export default function Refs({ refs }: { refs: Ref[] }) {
  return (
    <ul>
      {refs.map((item: Ref, i: number) => <li key={i}><Reference ref={tag(item)} /></li>)}
    </ul>
  )
}
