import React from 'react'
import { ListGroup } from 'react-bootstrap'

import Inline from '../Inline'

export default function Suggestions({
  apply,
  selected,
  suggestions
}: {
  apply: (index: number) => void
  selected: number | null,
  suggestions: readonly string[]
}) {
  return (
    <ListGroup>
      {suggestions.map((suggestion: string, index: number) =>
        <ListGroup.Item
          key={suggestion}
          active={index === selected}
          onClick={() => apply(index)}
          action
        >
          <Inline body={suggestion} />
        </ListGroup.Item>
      )}
    </ListGroup>
  )
}
