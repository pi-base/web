import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'

import { Store as S, useStore } from '../../models'
import { Store } from '../../models/Store/state'
import Detail from './Detail'
import List from './List'
import Name from './Name'
import RouteLookup from '../Shared/RouteLookup'

export { Name }

function find(store: Store, { id }: { id: string }) {
  const theorem = S.theorem(store, id)
  return theorem && { theorem }
}

function Index() {
  const theorems = S.theorems(useStore())
  return <List theorems={theorems} />
}

export default function () {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <RouteLookup path={`${path}/:id`} lookup={find} component={Detail} />
      <Route path={path} exact component={Index} />
    </Switch>
  )
}
