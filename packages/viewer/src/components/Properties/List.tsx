import React from 'react'
import { Link } from 'react-router-dom'

import { Property } from '../../models'
import paths from '../../paths'
import Filter, { useFilter } from '../Shared/Filter'
import { Preview, Title } from '../Shared/Display'
import Id from '../Shared/Id'
import Table from '../Shared/Table'

const Header = () =>
  <tr>
    <Table.Header sort="uid">Id</Table.Header>
    <Table.Header sort="name">Name</Table.Header>
    <Table.Header>Description</Table.Header>
  </tr>

const Row = ({ item: property }: { item: Property }) =>
  <tr>
    <td>
      <Link to={paths.property(property)}>
        <Id value={property.uid} />
      </Link>
    </td>
    <td>
      <Title body={property.name} />
    </td>
    <td>
      <Preview body={property.description} />
    </td>
  </tr>

export default React.memo(
  function PropertiesList({ properties }: { properties: Property[] }) {
    const {
      filtered,
      setFilter
    } = useFilter(properties)

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
)
