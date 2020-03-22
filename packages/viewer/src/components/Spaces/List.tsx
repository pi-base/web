import React from 'react'
import { Link } from 'react-router-dom'

import { Space } from '../../models'
import paths from '../../paths'
import { Preview, Title } from '../Shared/Display'
import Id from '../Shared/Id'
import Table from '../Shared/Table'

const Header = () =>
  <tr>
    <Table.Header sort="uid">Id</Table.Header>
    <Table.Header sort="name">Name</Table.Header>
    <Table.Header>Description</Table.Header>
  </tr>

const Row = ({ item: space }: { item: Space }) =>
  <tr>
    <td>
      <Link to={paths.space(space)}>
        <Id value={space.uid} />
      </Link>
    </td>
    <td>
      <Title body={space.name} />
    </td>
    <td>
      <Preview body={space.description} />
    </td>
  </tr>

export default function ({ spaces }: { spaces: Space[] }) {
  return (
    <Table
      Header={Header}
      Row={Row}
      collection={spaces}
    />
  )
}
