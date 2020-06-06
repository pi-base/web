import React, { useCallback, useMemo } from 'react'

import { Formula, formula as F } from '@pi-base/core'

import { Display } from '../../Shared/Formula'
import Hints from './Hints'
import { Property, Search, Space, Theorem } from '../../../models'
import { SearchResults } from '../../../models/Store'
import Spaces from '../List'
import Table from '../../Traits/Table'
import TheoremSummary from '../../Theorems/SummaryList'

function ByFormula({
  formula,
  results
}: {
  formula: Formula<Property>
  results: SearchResults
}) {
  if (results.kind === 'contradiction') {
    return (<Contradiction formula={formula} contradiction={results.contradiction} />)
  } else {
    return (<Matches formula={formula} spaces={results.spaces} />)
  }
}

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

function Matches({
  formula,
  spaces
}: {
  formula: Formula<Property>
  spaces: Space[]
}) {
  const Title = useCallback(
    function Title() {
      return (
        <>
          Spaces ⊢
          {' '}
          <Display value={formula} link="property" />
        </>
      )
    },
    [formula]
  )

  const properties = useMemo(
    () => Array.from(F.properties(formula)),
    [formula]
  )

  return (
    <Table Title={Title} spaces={spaces} properties={properties} />
  )
}

function ByText({
  results,
  text
}: {
  results: SearchResults
  text: string
}) {
  const spaces = results.kind === 'spaces' ? results.spaces : []

  return (
    <>
      <h5>
        Searching for
        {' '}
        <code>{text}</code>
      </h5>
      <Spaces spaces={spaces} />
    </>
  )
}

export default function Results({
  search,
  setSearch,
  results
}: {
  search: Search | null
  setSearch: (q: string) => void
  results: SearchResults
}) {
  if (!search) { return (<Hints setSearch={setSearch} />) }

  switch (search.kind) {
    case 'formula':
      return (<ByFormula formula={search.formula} results={results} />)
    case 'text':
      return (<ByText text={search.text} results={results} />)
  }
}
