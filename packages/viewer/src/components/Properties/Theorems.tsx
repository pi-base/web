import React from 'react'

import { Property, Store, useStore } from '../../models'
import Theorems from '../Theorems/SummaryList'

export default function ({ property }: { property: Property }) {
  const store = useStore()
  const theorems = Store.theoremsWithProperty(store, property)

  return (
    <Theorems theorems={theorems} />
  )
}
