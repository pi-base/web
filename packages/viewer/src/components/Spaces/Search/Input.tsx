import React, { useCallback, useEffect } from 'react'
import { InputGroup, Form } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'

import Suggestions from './Input/Suggestions'
import useSearch, { Action, ParseResult as PR } from './Input/useSearch'

export type ParseResult<Search, Fragment> = PR<Search, Fragment>

function handleKeyDown(dispatch: React.Dispatch<Action>) {
  return function (event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.keyCode) {
      case 38: // up
        return dispatch({ action: 'select_prev' })
      case 9:  // tab
      case 13: // enter
        event.preventDefault()
      // fall through
      case 39: // right
        return dispatch({ action: 'apply_suggestion' })
      case 40:
        return dispatch({ action: 'select_next' })
    }
  }
}

function handleChange(dispatch: React.Dispatch<Action>) {
  return function (event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ action: 'search', q: event.target.value, suggest: true })
  }
}

export default function SearchInput<Search, Fragment>({
  findSuggestions,
  onSearch,
  parse,
  q,
  replaceFragment,
  setQ
}: {
  findSuggestions: (fragment: Fragment) => string[]
  onSearch: (search: Search | null) => void
  parse: (q: string) => ParseResult<Search, Fragment>
  q: string
  replaceFragment: (q: string, fragment: Fragment, replacement: string) => string
  setQ: (q: string) => void
}) {
  const [
    { query, search, selected, suggestions },
    dispatch
  ] = useSearch<Search, Fragment>({
    findSuggestions,
    parse,
    query: q,
    replaceFragment
  })

  // TODO: need to either properly cast Immutable<Search> to Search or
  // update everything else to reflect that we have an Immutable<Search>
  useEffect(() => onSearch(search as Search | null), [onSearch, search])
  useEffect(() => setQ(query), [query, setQ])

  const onChange = useCallback(handleChange(dispatch), [dispatch])
  const onKeyDown = useCallback(handleKeyDown(dispatch), [dispatch])

  return (
    <>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          placeholder="'compact + ~metrizable' or 'plank'"
          autoComplete="off"
          value={query}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
      </InputGroup>
      {suggestions &&
        <Suggestions
          selected={selected}
          suggestions={suggestions}
        />
      }
    </>
  )
}
