import { renderHook, act } from '@testing-library/react-hooks'

import useSearch, { ParseResult } from './useSearch'

function findSuggestions(_: string) {
  return ['Alpha', 'Bravo', 'Charlie']
}

function parse(search: string): ParseResult<string, string> {
  const parts = search.split(',')
  return {
    fragment: parts[parts.length - 1],
    search,
  }
}

function replaceFragment(query: string, fragment: string, replacement: string) {
  return query
    .split(',')
    .map((part) => (part.trim() === fragment.trim() ? replacement : part))
    .join(', ')
}

it('searches', () => {
  const { result } = renderHook(() =>
    useSearch<string, string>({
      query: '',
      findSuggestions,
      parse,
      replaceFragment,
    })
  )

  let [state, dispatch] = result.current

  // Type and see a suggestion
  act(() => dispatch({ action: 'search', q: 'a,b', suggest: true }))

  expect(result.current[0]).toEqual({
    fragment: 'b',
    query: 'a,b',
    search: 'a,b',
    selected: null,
    suggestions: ['Alpha', 'Bravo', 'Charlie'],
  })

  // Select and apply a suggestion
  act(() => {
    dispatch({ action: 'select_next' })
    dispatch({ action: 'select_next' })
    dispatch({ action: 'apply_suggestion' })
  })

  state = result.current[0]

  expect(state.query).toEqual('a, Bravo')
  expect(state.search).toEqual('a, Bravo')
  expect(state.suggestions).toEqual([])

  // Clear out the search
  act(() => {
    dispatch({ action: 'search', q: '', suggest: true })
  })

  state = result.current[0]

  expect(state.query).toEqual('')
  expect(state.suggestions).toEqual([])
})
