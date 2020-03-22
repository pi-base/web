import React from 'react'
import { ProgressBar, Toast } from 'react-bootstrap'

import { Status } from '../models/Store'

function Checking({
  complete,
  total
}: {
  complete: number
  total: number
}) {
  return (
    <Toast
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px'
      }}
    >
      <Toast.Header
        closeButton={false}
      >
        Checking Theorems
      </Toast.Header>
      <Toast.Body>
        <ProgressBar
          animated
          now={complete}
          max={total}
          label={`${complete} / ${total}`}
          srOnly
        />
      </Toast.Body>
    </Toast>
  )
}

export default function StatusBar({
  status
}: {
  status: Status
}) {
  if (status.state === 'checking') {
    return (<Checking complete={status.complete} total={status.total} />)
  } else {
    return null
  }
}