import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'

import { Store as S } from '../../models'
import { Store } from '../../models/Store/state'
import Detail from './Detail'
import RouteLookup from '../Shared/RouteLookup'
import Search from './Search'

function find(store: Store, { id }: { id: string }) {
  const space = S.space(store, id)
  return space && { space }
}

export default function Spaces() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <RouteLookup path={`${path}/:id`} lookup={find} component={Detail} />
      <Route path={path} exact component={Search} />
    </Switch>
  )
}
