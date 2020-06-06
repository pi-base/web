import React from 'react'

import { formula as F } from '@pi-base/core'

import paths from '../../paths'
import { Property, Space, Store, Theorem, useStore } from '../../models'
import { spacesMatching } from '../../models/Store'
import SummaryList from './SummaryList'
import Table from '../Traits/Table'

function Holds({ theorems }: { theorems: Theorem[] }) {
  return (
    <>
      <p>The converse holds, by</p>
      <SummaryList theorems={theorems} />
    </>
  )

}

function Found({ spaces, properties }: { spaces: Space[], properties: Property[] }) {
  return (
    <>
      <p>The converse does not hold, as witnessed by</p>
      <Table
        spaces={spaces}
        properties={properties}
      />
    </>
  )
}

function NotFound() {
  return (
    <p>Could not find any counterexamples to the converse. If you know of one, consider <a href={paths.contributeExample()}>contributing it</a>.</p>
  )
}

export default function Converse({ theorem }: { theorem: Theorem }) {
  const store = useStore()

  if (theorem.converse && theorem.converse.length > 0) {
    const theorems = theorem.converse.map(id => Store.theorem(store, id)!)
    return (<Holds theorems={theorems} />)
  }

  const condition = F.and(
    theorem.then,
    F.negate(theorem.when)
  )

  const properties = Array.from(
    F.properties(condition),
    (id: string) => Store.property(store, id)!
  )

  const results = spacesMatching(store, condition)

  if (results.kind === 'spaces' && results.spaces.length > 0) {
    return (
      <Found
        spaces={results.spaces}
        properties={properties}
      />
    )
  } else if (results.kind === 'contradiction' && results.contradiction !== 'tautology') {
    return (<Holds theorems={results.contradiction} />)
  } else {
    return (
      <NotFound />
    )
  }
}
