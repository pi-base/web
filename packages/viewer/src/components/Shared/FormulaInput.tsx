import React, { useCallback, useState } from 'react'
import { Form } from 'react-bootstrap'

import Suggestions from './FormulaInput/Suggestions'
import { replaceEnd } from '../../util'

export const TAB = 9
export const ENTER = 13
export const UP = 38
export const RIGHT = 39
export const DOWN = 40

const separatorExp = /[~+&|()!?]/

function getFragment(str: string): string {
  if (!str) { return '' }

  const parts = str.split(separatorExp)
  return parts[parts.length - 1].trimLeft()
}

function replaceFragment(q: string, expanded: string) {
  if (q === '') { return '' }
  const frag = getFragment(q)
  if (frag === '') { return q }
  return replaceEnd(q, frag, expanded)
}

function wrap(current: number | null, delta: number, limit: number | undefined) {
  if (!limit) {
    return 0
  }

  if (current === null) {
    return delta > 0 ? 0 : limit - 1
  }

  let next = current + (delta % limit)
  if (next < 0) {
    next = next + limit
  }
  return next
}

export default function FormulaInput({
  getSuggestions,
  name = "formula",
  onChange,
  placeholder = "",
  value = ""
}: {
  getSuggestions: (text: string) => string[]
  name?: string
  onChange: (value: string) => void
  placeholder?: string
  value?: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [suggest, setSuggest] = useState(false)

  const suggestions = getSuggestions(getFragment(value))

  const handleChange = useCallback(
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const next = event.target.value

      setSelected(null)
      setSuggest(getFragment(next).trim().length > 0)
      onChange(next)
    }, [setSelected, setSuggest, onChange]
  )

  const applySuggestion = useCallback(
    function applySuggestion(index: number | null) {
      setSelected(null)
      setSuggest(false)
      if (index !== null && suggestions) {
        onChange(replaceFragment(value, suggestions[index]))
      }
    }, [suggestions, value, onChange, setSelected, setSuggest]
  )

  const handleKeyDown = useCallback(
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      switch (event.keyCode) {
        case UP:
          return setSelected(wrap(selected, -1, suggestions?.length))
        case DOWN:
          return setSelected(wrap(selected, 1, suggestions?.length))
        case TAB:
        case ENTER:
          event.preventDefault()
        // fall through
        case RIGHT:
          applySuggestion(selected)
          return
      }
    }, [selected, suggestions, applySuggestion, setSelected]
  )

  return (
    <>
      <Form.Control
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {suggest &&
        <Suggestions
          apply={applySuggestion}
          selected={selected}
          suggestions={suggestions}
        />}
    </>
  )
}
