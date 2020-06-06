import React, { useState } from 'react'
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Moment from 'react-moment'

import { Dispatch, hardReset, refresh } from '../actions'
import { Handler } from '../errors'
import { useStore } from '../models'
import { Store, status } from '../models/Store'

function Fetch({
  store,
  dispatch,
  handler
}: {
  store: Store,
  dispatch: Dispatch
  handler: Handler
}) {
  const [branch, setBranch] = useState(store.remote.branch)
  const [host, setHost] = useState(store.remote.host)

  async function save() {
    return refresh({ branch, dispatch, host, store, handler })
  }

  const fetching = status(store).state === 'fetching'

  return (
    <Table>
      <tbody>
        <tr>
          <th>Host</th>
          <td>
            <Form.Control
              value={host}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
              onBlur={save}
            />
          </td>
        </tr>
        <tr>
          <th>Branch</th>
          <td>
            <Form.Control
              value={branch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBranch(e.target.value)}
              onBlur={save}
            />
          </td>
        </tr>
        <tr>
          <th>ETag</th>
          <td>
            <code>{store.etag}</code>
          </td>
        </tr>
        <tr>
          <th>Synced</th>
          <td>
            <Moment fromNow ago>{store.remote.fetched}</Moment>
            {' '}
            ago
          </td>
        </tr>
        <tr>
          <td />
          <td>
            <Button
              onClick={save}
              variant="outline-dark"
              disabled={fetching}
            >
              {fetching && <Spinner animation="border" role="status" size="sm" as="span" />}
              Refresh
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

function Data({ store }: { store: Store }) {
  return (
    <Table>
      <tbody>
        <tr>
          <th>Checked</th>
          <td>{store.checked.size}</td>
        </tr>
        <tr>
          <th>Traits</th>
          <td>{store.bundle.traits.size}</td>
        </tr>
        <tr>
          <td />
          <td>
            <Button
              onClick={() => console.log(store)}
              variant="outline-dark"
            >
              Log Store
          </Button>
            <Button
              onClick={hardReset}
              variant="outline-danger"
            >
              Reset
          </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default function Dev({
  dispatch,
  handler
}: {
  dispatch: Dispatch
  handler: Handler
}) {
  const store = useStore()

  return (
    <Row>
      <Col>
        <Fetch store={store} dispatch={dispatch} handler={handler} />
      </Col>
      <Col>
        <Data store={store} />
      </Col>
    </Row>
  )
}