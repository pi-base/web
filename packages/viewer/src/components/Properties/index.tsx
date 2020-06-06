import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'

import { useStore } from '../../models'
import { Store, default as S } from '../../models/Store'
import Detail from './Detail'
import List from './List'
import RouteLookup from '../Shared/RouteLookup'

function find(store: Store, { id }: { id: string }) {
  const property = S.property(store, id)
  return property && { property }
}

function Index() {
  const properties = S.properties(useStore())
  return <List properties={properties} />
}

export default function Properties() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <RouteLookup path={`${path}/:id`} lookup={find} component={Detail} />
      <Route path={path} exact component={Index} />
    </Switch>
  )
}
