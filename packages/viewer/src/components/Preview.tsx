import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

import Display from './Shared/Display'

export default function Preview() {
  const [body, setBody] = useState('')

  return (
    <Row>
      <Col xs="6">
        <Form.Control
          as="textarea"
          rows={10}
          value={body}
          placeholder="Enter text to preview"
          onChange={e => setBody(e.target.value)}
        />
      </Col>
      <Col xs="6">
        <Display body={body} />
      </Col>
    </Row>
  )
}