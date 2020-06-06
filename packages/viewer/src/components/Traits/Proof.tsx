import React from 'react'
import { Col, Row } from 'react-bootstrap'

import { Space, useStore } from '../../models'
import { Proof, default as S } from '../../models/Store'
import Theorems from '../Theorems/SummaryList'
import Traits from '../Spaces/Traits'

export default function ({ space, proof }: { space: Space, proof: Proof }) {
  const store = useStore()

  const theorems = proof.theorems.map((id: string) => S.theorem(store, id)!)
  const properties = proof.properties.map((id: string) => S.property(store, id)!)

  return (
    <>
      <p>Automatically deduced from the following</p>
      <Row>
        <Col xs="6">
          <h5>Properties</h5>
          <Traits space={space} properties={properties} filter={false} />
        </Col>
        <Col xs="6">
          <h5>Theorems</h5>
          <Theorems theorems={theorems} />
        </Col>
      </Row>
    </>
  )
}
