import React from 'react'
import { Link } from 'react-router-dom'

import { Theorem } from '../../models'
import paths from '../../paths'
import Filter, { useFilter } from '../Shared/Filter'
import Formula from '../Shared/Formula'
import Id from '../Shared/Id'
import { Preview } from '../Shared/Display'
import Table from '../Shared/Table'

const Header = () =>
  <tr>
    <Table.Header sort="uid">Id</Table.Header>
    <Table.Header sort="when">When</Table.Header>
    <Table.Header sort="then">Then</Table.Header>
    <Table.Header>Description</Table.Header>
  </tr>

const Row = ({ item: theorem }: { item: Theorem }) =>
  <tr>
    <td>
      <Link to={paths.theorem(theorem)}>
        <Id value={theorem.uid} />
      </Link>
    </td>
    <td>
      <Formula value={theorem.when} link='property' />
    </td>
    <td>
      <Formula value={theorem.then} link='property' />
    </td>
    <td>
      <Preview body={theorem.description} />
    </td>
  </tr>

export default React.memo(
  function TheoremList({ theorems }: { theorems: Theorem[] }) {
    const {
      filtered,
      setFilter
    } = useFilter(
      theorems,
      {
        weights: [
          { name: 'when', weight: 0.7 },
          { name: 'then', weight: 0.7 },
          { name: 'description', weight: 0.2 }
        ]
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
)
