import React from 'react'

import { Property, useStore } from '../../models'
import { theoremsWithProperty } from '../../models/Store'
import Theorems from '../Theorems/SummaryList'

export default function ({ property }: { property: Property }) {
  const store = useStore()
  const theorems = theoremsWithProperty(store, property)

  return (
    <Theorems theorems={theorems} />
  )
}
