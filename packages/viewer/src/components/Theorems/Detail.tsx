import React from 'react'

import { Theorem } from '../../models'
import Converse from './Converse'
import Display from '../Shared/Display'
import Name from './Name'
import Refs from '../Shared/Refs'
import { Tab, Tabs } from '../Shared/RouteTabs'

export default React.memo(
  function Detail({ theorem }: { theorem: Theorem }) {
    return (
      <>
        <h1>
          <Name theorem={theorem} link='property' />
        </h1>
        <Display body={theorem.description} />
        <Tabs initial="converse">
          <Tab eventKey="converse" title="Converse">
            <Converse theorem={theorem} />
          </Tab>
          <Tab eventKey="references" title="References">
            <Refs refs={theorem.refs} />
          </Tab>
        </Tabs>
      </>
    )
  }
)
