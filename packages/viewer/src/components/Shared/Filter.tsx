import React, { useEffect, useMemo, useState } from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import Fuse from 'fuse.js'

import { useQueryParam } from '../../hooks'

const defaultWeights: Fuse.FuseOptionKeyObject[] = [
  { name: 'name', weight: 0.7 },
  { name: 'aliases', weight: 0.5 },
  { name: 'description', weight: 0.2 },
]

const defaultFuseOptions: Fuse.IFuseOptions<any> = {
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.4
}

export function useFilter<T>(
  collection: T[],
  {
    weights = defaultWeights
  }: {
    weights?: Fuse.FuseOptionKeyObject[] | string[]
  } = {}
) {
  const [filter, setFilter] = useState('')

  const index = useMemo(
    () => new Fuse(collection, { ...defaultFuseOptions, keys: weights }),
    [collection, weights]
  )

  const filtered = useMemo(
    () => filter === '' ? collection : index.search(filter).map(r => r.item),
    [collection, filter, index]
  )

  return {
    filter,
    filtered,
    setFilter
  }
}

export default function Filter({
  queryParam = 'filter',
  onChange
}: {
  queryParam?: string
  onChange: (filter: string) => void
}) {
  const [value, setValue] = useQueryParam(queryParam)

  useEffect(
    () => onChange(value),
    [onChange, value]
  )

  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        placeholder="Filter"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </InputGroup>
  )
}
