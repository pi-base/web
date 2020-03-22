import React from 'react'
import * as Bootstrap from 'react-bootstrap'
import { useHistory, useRouteMatch } from 'react-router'

export { Tab } from 'react-bootstrap'

export function Tabs({ initial, children }: {
  initial: string,
  children: any
}) {
  const history = useHistory()
  const { url: base } = useRouteMatch()
  const match = useRouteMatch<{ tab: string }>({
    path: `${base}/:tab`
  })
  const tab = (match && match.params.tab) || initial

  const setTab = (tab: string) => history.push(`${base}/${tab}`)

  return (
    <Bootstrap.Tabs
      id="route-tabs"
      activeKey={tab}
      onSelect={setTab}
      children={children}
    />
  )
}
