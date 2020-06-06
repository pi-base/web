import React, { useEffect } from 'react'
import { Jumbotron, Spinner } from 'react-bootstrap'
import { matchPath } from 'react-router'
import { useHistory, useLocation } from 'react-router-dom'

import { useStore } from '../../models'
import paths from '../../paths'
import { useErrorHandler } from '../../errors'
import { loaded } from '../../models/Store'

export default function NotFound() {
  const store = useStore()
  const { error } = useErrorHandler()
  const history = useHistory()
  const location = useLocation()

  let redirect: string | null = null
  const isLoaded = loaded(store)

  const match = matchPath<{ id: string }>(location.pathname, { path: "/theorems/:id" })
  if (match && match.params.id.startsWith('I')) {
    redirect = `/theorems/${match.params.id.replace('I', 'T')}`
  }

  useEffect(
    () => {
      if (isLoaded) {
        error(new Error('Not Found'), { location, redirect })

        if (redirect) { history.push(redirect) }
      }
    },
    [error, location, history, redirect, isLoaded]
  )

  if (!isLoaded) {
    return (
      <>
        <Spinner animation="border" role="status" />
        {' '}
        Loading ...
      </>
    )
  }

  const issueUrl = paths.viewerIssues({
    title: `Could not find \`${location.pathname + location.search}\``,
    body: 'If possible, add a description of how you got to this page, and what you\'d expect to find here.'
  })

  return (
    <Jumbotron>
      <h1>404 Not Found</h1>
      <p>
        You appear to be looking for
        {' '}
        <code>{location.pathname}</code>,
        but no matching page was found.
      </p>
      <p>
        If this is a bug, please help out by <a href={issueUrl}>reporting it</a>.
      </p>
    </Jumbotron>
  )
}