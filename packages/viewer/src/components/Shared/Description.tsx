import React from 'react'

import { Ref } from '@pi-base/core'

import Display from './Display'
import Refs from './Refs'

function References({ refs }: { refs: Ref[] }) {
  return (
    <>
      <h4>References</h4>
      <Refs refs={refs} />
    </>
  )

}

export default function Description({ body, refs = [] }: {
  body: string
  refs?: Ref[]
}) {
  return (
    <>
      <Display body={body} />
      {refs.length > 0 && <References refs={refs} />}
    </>
  )

}
