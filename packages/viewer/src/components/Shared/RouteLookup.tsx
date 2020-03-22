import React from 'react'
import { Route } from 'react-router'

import { useParams } from 'react-router-dom'
import { useStore } from '../../models'
import { Store } from '../../models/Store/state'
import NotFound from './NotFound'

function Lookup<P, V>({
  Component,
  lookup
}: {
  Component: any
  lookup: (store: Store, params: any) => V | undefined
}) {
  const store = useStore()
  const props = lookup(store, useParams())

  if (props) {
    return <Component {...props} />
  } else {
    return <NotFound />
  }
}

export default function RouteLookup<Params, Props>({
  path,
  component: Component,
  lookup
}: {
  path: string
  component: any
  lookup: (store: Store, params: any) => Props | undefined
}) {
  return (
    <Route path={path}>
      <Lookup lookup={lookup} Component={Component} />
    </Route>
  )
}
