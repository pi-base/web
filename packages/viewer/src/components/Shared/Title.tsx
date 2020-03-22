import React from 'react'

import Aliases from './Aliases'
import { Title as Inline } from './Display'

export default function Title({ title, aliases }: {
  title: string,
  aliases?: string[]
}) {
  return (
    <h1>
      <Inline body={title} />
      {aliases && <Aliases names={aliases} />}
    </h1>
  )
}