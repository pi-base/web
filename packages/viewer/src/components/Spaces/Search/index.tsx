import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'

import { formula as F } from '@pi-base/core'

import { useQueryParam } from '../../../hooks'
import { Search, useStore } from '../../../models'
import { SearchResults, resolveProperty, search as searchStore, searchProperties } from '../../../models/Store'
import { Store } from '../../../models/Store'
import Input, { ParseResult } from './Input'
import Results from './Results'

const separators = new Set(['~', '+', '&', '|', '(', ')', '!', '?'])

function getFragment(str: string): [string, string] {
  if (!str) { return ['', ''] }

  for (let i = str.length; i > 0; i--) {
    if (separators.has(str[i])) {
      return [str.slice(0, i).trim(), str.slice(i + 1).trim()]
    }
  }

  return [str.trim(), '']
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceFragment(q: string, frag: string, expanded: string) {
  if (q === '') { return '' }
  if (frag === '') { return q }

  const rexp = new RegExp(escapeRegExp(frag) + '$')
  return q.replace(rexp, expanded)
}

function parser(store: Store) {
  return function parse(q: string): ParseResult<Search, string> {
    const [prefix, fragment] = getFragment(q)
    const textSearch: ParseResult<Search, string> =
      q === ''
        ? { fragment }
        : { fragment, search: { kind: 'text', text: q } }

    const parsed = F.parse(fragment === '' ? prefix : q)
    if (!parsed) { return textSearch }

    const resolved = F.mapProperty((p: string) => resolveProperty(store, p), parsed)
    const formula = F.compact(resolved)
    if (!formula) { return textSearch }

    return {
      fragment,
      search: { kind: 'formula', formula }
    }
  }
}

function suggester(store: Store) {
  return function findSuggestions(fragment: string) {
    return searchProperties(store, fragment).slice(0, 10).map(p => p.name)
  }
}

const initialResults: SearchResults = {
  kind: 'spaces',
  spaces: []
}

export default React.memo(
  function SpaceSearch() {
    const store = useStore()
    const [q, setQ] = useQueryParam('q')
    const [search, setSearch] = useState<Search | null>(null)

    const parse = useMemo(() => parser(store), [store])
    const findSuggestions = useMemo(() => suggester(store), [store])

    // For legacy compatibility, allow reading ?text= as ?q=
    const [text, setText] = useQueryParam('text')
    useEffect(
      () => {
        if (text && !q) {
          setQ(text)
          setText('')
        }
      }
    )

    const results = search ? searchStore(store, search) : initialResults

    return (
      <Row>
        <Col xs="4">
          <Input
            findSuggestions={findSuggestions}
            parse={parse}
            q={q}
            replaceFragment={replaceFragment}
            setQ={setQ}
            onSearch={setSearch}
          />
        </Col>
        <Col xs="8">
          <Results
            search={search}
            setSearch={setQ}
            results={results}
          />
        </Col>
      </Row>
    )
  }
)
