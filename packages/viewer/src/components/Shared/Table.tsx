import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Bootstrap from 'react-bootstrap'

import { useSort } from '../../hooks'

const SortContext = createContext(
  (_: string) => { }
)

function Table<T>({
  collection,
  Header,
  Row,
  ...rest
}: {
  collection: T[]
  Header: React.FunctionComponent
  Row: React.FunctionComponent<{ item: T }>
}) {
  const [items, setItems] = useState<T[]>(collection)

  useEffect(
    () => setItems(collection),
    [collection]
  )

  const { sort, sorted } = useSort<T>(items)

  return (
    <SortContext.Provider value={sort}>
      <Bootstrap.Table bordered={false}>
        <thead>
          <Header />
        </thead>
        <tbody>
          {sorted.map((item: T, index: number) =>
            <Row key={index} item={item} {...rest} />
          )}
        </tbody>
      </Bootstrap.Table>
    </SortContext.Provider>
  )
}

interface HeaderProps<T> extends React.ComponentProps<'th'> {
  sort?: keyof T
}

function Header<T>({ sort, children, ...rest }: HeaderProps<T>) {
  const toggleSort = useContext(SortContext)

  let props = rest

  if (sort) {
    props = {
      ...props,
      onClick: () => toggleSort(sort.toString())
    }
  }

  return (
    <th {...props}>
      {children}
    </th>
  )
}

Table.Header = Header

export default Table
