import React from 'react'
import { Container } from 'react-bootstrap'
import { Switch, Route } from 'react-router-dom'

import Dev from './Dev'
import Home from './Home'
import NotFound from './Shared/NotFound'
import Properties from './Properties'
import Spaces from './Spaces'
import Theorems from './Theorems'
import Traits from './Traits'

import { Dispatch } from '../actions'
import { Handler } from '../errors'

export default React.memo(
  function Main({
    dispatch,
    handler
  }: {
    dispatch: Dispatch
    handler: Handler
  }) {
    return (
      <Container>
        <Switch>
          <Route path="/spaces/:spaceId/properties/:propertyId" component={Traits} />
          <Route path="/spaces" component={Spaces} />
          <Route path="/properties" component={Properties} />
          <Route path="/theorems" component={Theorems} />
          <Route path="/dev">
            <Dev dispatch={dispatch} handler={handler} />
          </Route>
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    )
  }
)
