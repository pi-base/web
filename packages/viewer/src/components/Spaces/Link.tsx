import React from 'react'

import Inline from '../Shared/Inline'
import Link from '../Shared/Link'
import * as Store from '../../models/Store/state'
import { Space } from '../../models'

export default function ({ id }: { id: number }) {
  return (
    <Link<Space>
      id={id}
      find={Store.space}
      path={(uid: string) => `/spaces/${uid}`}
      contents={(space: Space) => <Inline body={space.name} />}
      kind="Space"
    />
  )
}