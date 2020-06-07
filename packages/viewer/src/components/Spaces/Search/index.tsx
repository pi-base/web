import React, { useCallback, useEffect, useRef } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { StringParam, useQueryParam } from 'use-query-params'

import { formula as F } from '@pi-base/core'

import { Formula, Search, useStore } from '../../../models'
import { resolveProperty, searchProperties } from '../../../models/Store'
import { Store } from '../../../models/Store'
import FormulaInput from '../../Shared/FormulaInput'
import Results from './Results'

function parse(store: Store, q: string): Formula | null {
  const parsed = F.parse(q)
  if (!parsed) { return null }

  const resolved = F.mapProperty((p: string) => resolveProperty(store, p), parsed)
  const formula = F.compact(resolved)
  return formula || null
}

export default React.memo(
  function SpaceSearch() {
    const [q, setQ] = useQueryParam('q', StringParam)
    const [text, setText] = useQueryParam('text', StringParam)

    const store = useStore()
    const parsed = parse(store, q || '')

    const formulaRef = useRef<Formula | null>(null)
    useEffect(() => {
      if (parsed || !q) {
        formulaRef.current = parsed
      }
    }, [parsed, q])

    const formula = q ? parsed || formulaRef.current : null

    const search: Search = { formula, text: text || '' }

    const getSuggestions = useCallback(
      (text: string) => searchProperties(store, text).slice(0, 10).map(p => p.name),
      [store]
    )

    return (
      <Row>
        <Col xs="4">
          <Form.Group>
            <Form.Label>Filter by Text</Form.Label>
            <Form.Control
              name="text"
              value={text || ''}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. plank"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Filter by Formula</Form.Label>
            <FormulaInput
              name="q"
              value={q || ''}
              onChange={setQ}
              placeholder="e.g. compact + ~metrizable"
              getSuggestions={getSuggestions}
            />
          </Form.Group>
        </Col>
        <Col xs="8">
          <Results
            search={search}
            setSearch={setQ}
            store={store}
          />
        </Col>
      </Row>
    )
  }
)
