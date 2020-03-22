import React from 'react'

import { Property } from '../../models'
import Display from '../Shared/Display'
import Refs from '../Shared/Refs'
import { Tab, Tabs } from '../Shared/RouteTabs'
import Title from '../Shared/Title'
import Traits from './Traits'
import Theorems from './Theorems'

export default React.memo(
  function Detail({ property }: { property: Property }) {
    return (
      <>
        <Title title={property.name} aliases={property.aliases} />
        <Display body={property.description} />
        <Tabs initial="theorems">
          <Tab eventKey="theorems" title="Theorems">
            <Theorems property={property} />
          </Tab>
          <Tab eventKey="spaces" title="Spaces">
            <Traits property={property} />
          </Tab>
          <Tab eventKey="references" title="References">
            <Refs refs={property.refs} />
          </Tab>
        </Tabs>
      </>
    )
  }
)
