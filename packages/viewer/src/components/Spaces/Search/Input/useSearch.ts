import { useEffect, useMemo, useReducer } from 'react'
import produce from 'immer'

export type ParseResult<Search, Fragment> = {
  search?: Search
  fragment?: Fragment
}

type State<Search, Fragment> = {
  fragment: Fragment | null
  query: string
  search: Search | null
  selected: number | null
  suggestions: string[]
}

export type Action
  = { action: 'apply_suggestion' }
  | { action: 'search', q?: string, suggest: boolean }
  | { action: 'select_next' }
  | { action: 'select_prev' }

function runSearch<Search, Fragment>(
  state: State<Search, Fragment>,
  query: string,
  parse: (q: string) => ParseResult<Search, Fragment>
) {
  state.query = query
  state.selected = null

  if (state.query === '') {
    state.fragment = null
    state.search = null
    return
  }

  const { search, fragment } = parse(query)
  if (search) { state.search = search }
  state.fragment = fragment || null
}

function wrap(current: number | null, delta: number, limit: number) {
  if (limit === 0) { return 0 }
  if (current === null) { return delta > 0 ? 0 : limit - 1 }

  let next = current + delta % limit
  if (next < 0) { next = next + limit }
  return next
}

export default function useSearch<Search, Fragment>({
  findSuggestions,
  parse,
  query,
  replaceFragment
}: {
  findSuggestions: (fragment: Fragment) => string[]
  parse: (q: string) => ParseResult<Search, Fragment>
  query: string
  replaceFragment: (query: string, fragment: Fragment, replacement: string) => string
}) {
  const reducer = useMemo(
    () => produce((state: State<Search, Fragment>, action: Action) => {
      switch (action.action) {
        case 'search':
          runSearch(state, action.q || state.query, parse)
          if (state.fragment && action.suggest) {
            state.suggestions = findSuggestions(state.fragment) || []
          }
          return
        case 'select_next':
          state.selected = wrap(state.selected, 1, state.suggestions.length)
          return
        case 'select_prev':
          state.selected = wrap(state.selected, -1, state.suggestions.length)
          return
        case 'apply_suggestion':
          if (!state.fragment) { return }

          const selected = state.selected || 0
          const suggestion = state.suggestions[selected]
          if (!suggestion) { return }

          runSearch(
            state,
            replaceFragment(state.query, state.fragment, suggestion),
            parse
          )
          state.suggestions = []
          return
      }
    }),
    [findSuggestions, parse, replaceFragment]
  )

  const result = useReducer(reducer, {
    fragment: null,
    query: '',
    search: null,
    selected: null,
    suggestions: []
  })

  // Ensure that we refresh `search` as `parse` changes (e.g. as new properties are loaded)
  const dispatch = result[1]
  useEffect(() => dispatch({ action: 'search', suggest: false }), [dispatch, parse])
  useEffect(() => dispatch({ action: 'search', q: query, suggest: false }), [dispatch, query])

  return result
}
