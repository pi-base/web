import React from 'react'
import { Table as BTable } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { Property, Space, useStore } from '../../models'
import * as Store from '../../models/Store'
import paths from '../../paths'
import { Title as Label } from '../Shared/Display'
import Value from '../Traits/Value'

function Cell({
  property,
  space,
  store
}: {
  property: Property,
  space: Space,
  store: Store.Store
}) {
  const trait = Store.trait(store, { space: space.uid, property: property.uid })
  if (!trait) { return null }

  return (
    <Link to={paths.trait(trait)}>
      <Value value={trait && trait.value} />
    </Link>
  )
}

function Row({
  properties,
  space,
  store
}: {
  properties: Property[],
  space: Space,
  store: Store.Store
}) {
  return (
    <tr>
      <td>
        <Link to={paths.space(space)}>
          <Label body={space.name} />
        </Link>
      </td>
      {properties.map((property: Property) =>
        <td key={property.uid}>
          <Cell store={store} space={space} property={property} />
        </td>
      )}
    </tr>
  )
}

export default function Table({
  Title,
  properties,
  spaces
}: {
  Title?: React.SFC
  properties: Property[]
  spaces: Space[]
}) {
  const store = useStore()

  return (
    <BTable>
      <thead>
        <tr>
          <th>{Title && <Title />}</th>
          {properties.map((property: Property) =>
            <th key={property.uid}>
              <Link to={paths.property(property)}>
                <Label body={property.name} />
              </Link>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {spaces.map((space: Space) =>
          <Row key={space.uid} store={store} properties={properties} space={space} />
        )}
      </tbody>
    </BTable>
  )
}