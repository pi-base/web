import React from 'react'

import { Formula, formula as F } from '@pi-base/core'

import { Display } from '../../Shared/Formula'
import Hints from './Hints'
import { Property, Search, Theorem } from '../../../models'
import { Store, search as searchStore } from '../../../models/Store'
import Spaces from '../List'
import Table from '../../Traits/Table'
import TheoremSummary from '../../Theorems/SummaryList'

function Contradiction({
  formula,
  contradiction
}: {
  formula: Formula<Property>
  contradiction: Theorem[] | 'tautology'
}) {
  if (contradiction === 'tautology') {
    return (
      <h5>
        <Display value={formula} link="property" />
        {' '}
        is a contradiction
      </h5>
    )
  } else {
    return (
      <>
        <h5>
          <Display value={formula} link="property" />
          {' '}
          is impossible by
        </h5>
        <TheoremSummary theorems={contradiction} />
      </>
    )
  }
}

export default function Results({
  search,
  setSearch,
  store
}: {
  search: Search
  setSearch: (q: string) => void
  store: Store
}) {
  if (!search.formula && !search.text) { return (<Hints setSearch={setSearch} />) }

  const results = searchStore(store, search)

  if (results.kind === 'contradiction') {
    return <Contradiction contradiction={results.contradiction} formula={search?.formula!} />
  }

  const fragments = [<span key={1}>Spaces </span>]
  if (search.text) {
    fragments.push(<span key={2}>matching <code>{search.text}</code> </span>)
  }
  if (search.text && search.formula) {
    fragments.push(<span key={3}>and </span>)
  }
  if (search.formula) {
    fragments.push(<span key={4}>satisfying <Display value={search.formula} link="property" /></span>)
  }

  return (
    <>
      <h5>{fragments}</h5>
      {search?.formula
        ? <Table
          spaces={results.spaces}
          properties={Array.from(F.properties(search.formula))} />
        : <Spaces spaces={results.spaces} />
      }
    </>
  )
}
