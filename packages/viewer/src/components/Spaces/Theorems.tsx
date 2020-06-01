import React from 'react'

import { Space, Store, useStore } from '../../models'
import { Title as Inline } from '../Shared/Display'
import SummaryList from '../Theorems/SummaryList'

const NoCounterexamples = ({ space }: { space: Space }) =>
  <>
    <Inline body={space.name} />
    {' is not a counterexample for any recorded theorems'}
  </>

export default function Theorems({ space }: { space: Space }) {
  const store = useStore()
  const theorems = Store.theoremsWithCounterexample(store, space)

  if (theorems.length > 0) {
    return (
      <>
        <p>
          <Inline body={space.name} />
          {' is a counterexample to the converse of '}
          {theorems.length}
          {' theorems:'}
        </p>
        <SummaryList theorems={theorems} />
      </>
    )
  } else {
    return (<NoCounterexamples space={space} />)
  }
}