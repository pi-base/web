import React, { useState } from 'react'
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Moment from 'react-moment'

import { Dispatch, refresh } from '../actions'
import { useStore } from '../models'
import { Store, fetching } from '../models/Store'

function reset() {
  localStorage.clear()
  window.location.reload()
}

function Fetch({
  store,
  dispatch
}: {
  store: Store,
  dispatch: Dispatch
}) {
  const [branch, setBranch] = useState(store.remote.branch)
  const [host, setHost] = useState(store.remote.host)

  async function save() {
    return refresh({ branch, dispatch, host, store })
  }

  return (
    <Table>
      <tbody>
        <tr>
          <th>ETag</th>
          <td>
            <code>{store.etag}</code>
          </td>
        </tr>
        <tr>
          <th>Host</th>
          <td>
            <Form.Control
              value={host}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <th>Branch</th>
          <td>
            <Form.Control
              value={branch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBranch(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <th>Fetched</th>
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
              disabled={fetching(store)}
            >
              {fetching(store) && <Spinner animation="border" role="status" size="sm" as="span" />}
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
              onClick={reset}
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

export default function Dev({ dispatch }: { dispatch: Dispatch }) {
  const store = useStore()

  return (
    <Row>
      <Col>
        <Fetch store={store} dispatch={dispatch} />
      </Col>
      <Col>
        <Data store={store} />
      </Col>
    </Row>
  )
}