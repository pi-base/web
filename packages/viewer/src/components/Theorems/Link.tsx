import React from 'react'

import Link from '../Shared/Link'
import Name from './Name'
import * as Store from '../../models/Store/state'
import { Theorem } from '../../models'

export default function ({ id }: { id: number }) {
  return (
    <Link<Theorem>
      id={id}
      find={Store.theorem}
      path={(uid: string) => `/theorems/${uid}`}
      contents={(theorem: Theorem) => <Name theorem={theorem} link="none" />}
      kind="Theorem"
    />
  )
}