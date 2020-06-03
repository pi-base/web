import React, { useCallback } from 'react'
import { InputGroup, Form } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'

import { useChange } from '../../../hooks'
import Suggestions from './Input/Suggestions'
import useSearch, { Action, ParseResult as PR } from './Input/useSearch'

export type ParseResult<Search, Fragment> = PR<Search, Fragment>

function handleKeyDown(dispatch: React.Dispatch<Action>) {
  return function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
    { search, selected, suggestions },
    dispatch
  ] = useSearch<Search, Fragment>({
    findSuggestions,
    parse,
    replaceFragment
  })

  useChange(q, () => dispatch({ action: 'search', q }))
  useChange(search, () => onSearch(search as Search))

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
          value={q}
          onKeyDown={onKeyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
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
