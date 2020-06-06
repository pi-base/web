import React from 'react'
import { Button, ProgressBar, Toast } from 'react-bootstrap'

import { hardReset } from '../actions'
import * as paths from '../paths'
import { Status } from '../models/Store'

function Notice({
  title,
  children
}: {
  title: string
  children: React.ReactNode[] | React.ReactNode
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
        {title}
      </Toast.Header>
      <Toast.Body>
        {children}
      </Toast.Body>
    </Toast>
  )
}

function Checking({
  complete,
  total
}: {
  complete: number
  total: number
}) {
  return (
    <Notice
      title="Checking Theorems"
    >
      <ProgressBar
        animated
        now={complete}
        max={total}
        label={`${complete} / ${total}`}
        srOnly
      />
    </Notice>
  )
}

function Error({ error }: { error: string | null }) {
  const issueUrl = paths.viewerIssues({
    title: error || 'Viewer failing to load',
    body: 'If possible, add any extra information that could help to troubleshoot the issue.'
  })

  return (
    <Notice
      title="Failed to Load"
    >
      <p>An error has prevented the viewer from loading.</p>
      {error && <p><code>{error}</code></p>}
      <p>If this error persists, you can help by <a href={issueUrl}>reporting it</a>.</p>
      <Button
        onClick={hardReset}
        variant="outline-danger"
      >
        Reset
      </Button>
    </Notice>
  )
}

export default function StatusBar({
  status
}: {
  status: Status
}) {
  switch (status.state) {
    case 'checking':
      return (<Checking complete={status.complete} total={status.total} />)
    case 'error':
      return (<Error error={status.message} />)
    default:
      return null
  }
}