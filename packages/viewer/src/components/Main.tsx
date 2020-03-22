import React from 'react'
import { Container } from 'react-bootstrap'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import NotFound from './Shared/NotFound'
import Properties from './Properties'
import Spaces from './Spaces'
import Theorems from './Theorems'
import Traits from './Traits'

export default React.memo(
  function Main() {
    return (
      <Container>
        <Switch>
          <Route path="/spaces/:spaceId/properties/:propertyId" component={Traits} />
          <Route path="/spaces" component={Spaces} />
          <Route path="/properties" component={Properties} />
          <Route path="/theorems" component={Theorems} />
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    )
  }
)
