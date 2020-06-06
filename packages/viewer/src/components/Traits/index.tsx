import React from 'react'

import Trait from './Detail'
import { Store, default as S } from '../../models/Store'
import RouteLookup from '../Shared/RouteLookup'

const findTrait = (store: Store, { spaceId, propertyId }: { spaceId: string, propertyId: string }) => {
  if (!spaceId || !propertyId) { return }

  const space = S.space(store, spaceId)
  const property = S.property(store, propertyId)
  const trait = S.trait(store, { space: spaceId, property: propertyId })

  return property && space && trait && { property, space, trait }
}

export default function Traits({ path }: { path: string }) {
  return (
    <RouteLookup
      path={path}
      lookup={findTrait}
      component={Trait}
    />
  )
}