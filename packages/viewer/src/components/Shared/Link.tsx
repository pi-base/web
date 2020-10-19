import React from 'react'
import { Link as A } from 'react-router-dom'

import * as Id from '@pi-base/core/lib/Id'

import * as Store from '../../models/Store/state'
import { useStore } from '../../models'

export default function Container<T>({
  id,
  find,
  path,
  contents,
  kind,
  prefix
}: {
  id: number,
  find: (store: Store.Store, uid: string) => T | null
  path: (uid: string) => string
  contents: (object: T) => JSX.Element
  kind: string
  prefix?: string
}) {
  const store = useStore()
  const uid = Id.expand(prefix || kind[0].toUpperCase(), id)
  const to = path(uid)
  const object = find(store, uid)

  if (object) {
    return (
      <A to={to}>{contents(object)}</A>
    )
  } else {
    return (
      <>
        {`${kind} not found: `}
        <A to={to}>{uid}</A>
      </>
    )
  }
}