import React from 'react'
import { Link } from 'react-router-dom'

import { Theorem } from '../../models'
import paths from '../../paths'
import Formula from '../Shared/Formula'
import Id from '../Shared/Id'
import Table from '../Shared/Table'

const Header = () =>
  <tr>
    <Table.Header>Id</Table.Header>
    <Table.Header sort="when">When</Table.Header>
    <Table.Header sort="then">Then</Table.Header>
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
  </tr>

export default React.memo(
  function SummaryList({ theorems }: { theorems: Theorem[] }) {
    return (
      <Table
        Header={Header}
        Row={Row}
        collection={theorems}
      />
    )
  }
)
