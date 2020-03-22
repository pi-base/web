import React from 'react'

import { Space } from '../../models'
import Display from '../Shared/Display'
import Refs from '../Shared/Refs'
import { Tab, Tabs } from '../Shared/RouteTabs'
import Theorems from './Theorems'
import Title from '../Shared/Title'
import Traits from './Traits'

export default React.memo(
  function Detail({ space }: { space: Space }) {
    return (
      <>
        <Title title={space.name} aliases={space.aliases} />
        <Display body={space.description} />
        <Tabs initial="theorems">
          <Tab eventKey="theorems" title="Theorems">
            <Theorems space={space} />
          </Tab>
          <Tab eventKey="properties" title="Properties">
            <Traits space={space} filter={true} />
          </Tab>
          <Tab eventKey="references" title="References">
            <Refs refs={space.refs} />
          </Tab>
        </Tabs>
      </>
    )
  }
)
