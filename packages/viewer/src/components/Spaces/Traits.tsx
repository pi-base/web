import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'

import Filter, { useFilter } from '../Shared/Filter'
import { Property, Space, Trait, useStore } from '../../models'
import Store from '../../models/Store'
import paths from '../../paths'
import Table from '../Shared/Table'
import { Title as Inline } from '../Shared/Display'
import Value from '../Traits/Value'

const Header = () =>
  <tr>
    <Table.Header>Property</Table.Header>
    <Table.Header>Value</Table.Header>
    <Table.Header>Deduced</Table.Header>
  </tr>

const Row = ({ item: { property, trait } }: { item: { property: Property, trait: Trait } }) =>
  <tr>
    <td>
      <Link to={paths.property(property)}>
        <Inline body={property.name} />
      </Link>
    </td>
    <td>
      <Link to={paths.trait(trait)}>
        <Value value={trait.value} />
      </Link>
    </td>
    <td>
      {trait.proof && <FaCheck />}
    </td>
  </tr>

function traitsWithProperties<T>(
  traits: Map<string, T>,
  properties: Property[] | undefined
) {
  if (!properties) { return traits }

  const acc = new Map<string, T>()
  properties.forEach((property: Property) => {
    const found = traits.get(property.uid)
    if (found) { acc.set(property.uid, found) }
  })
  return acc
}

export default function Traits({
  space,
  properties,
  filter = true
}: {
  space: Space,
  properties?: Property[],
  filter?: boolean
}) {
  const store = useStore()
  const allTraits = Store.traitsForSpace(store, space)
  const traits = Array.from(traitsWithProperties(allTraits, properties).values())

  const {
    filtered,
    setFilter
  } = useFilter(
    traits,
    {
      weights: [
        { name: 'property.name', weight: 0.7 },
        { name: 'property.aliases', weight: 0.5 },
        { name: 'property.description', weight: 0.2 }
      ]
    }
  )

  return (
    <>
      {filter && <Filter onChange={setFilter} />}
      <Table
        Header={Header}
        Row={Row}
        collection={filter ? filtered : traits}
      />
    </>
  )
}