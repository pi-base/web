import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'

import Filter, { useFilter } from '../Shared/Filter'
import { Property, Space, Trait, useStore } from '../../models'
import Store from '../../models/Store'
import paths from '../../paths'
import { Title as Inline } from '../Shared/Display'
import Table from '../Shared/Table'
import Value from '../Traits/Value'

const Header = () =>
  <tr>
    <Table.Header>Space</Table.Header>
    <Table.Header>Value</Table.Header>
    <Table.Header>Deduced</Table.Header>
  </tr>

const Row = ({ item: { space, trait } }: { item: { space: Space, trait: Trait } }) =>
  <tr>
    <td>
      <Link to={paths.space(space)}>
        <Inline body={space.name} />
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
  </tr >

export default function Spaces({ property }: { property: Property }) {
  const store = useStore()
  const traits = Array.from(Store.traitsForProperty(store, property).values())

  const {
    filtered,
    setFilter
  } = useFilter(
    traits,
    {
      weights: [
        { name: 'space.name', weight: 0.7 },
        { name: 'space.aliases', weight: 0.5 },
        { name: 'space.description', weight: 0.2 }
      ],
    }
  )

  return (
    <>
      <Filter onChange={setFilter} />
      <Table
        Header={Header}
        Row={Row}
        collection={filtered}
      />
    </>
  )
}
