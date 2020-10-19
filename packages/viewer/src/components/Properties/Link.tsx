import React from 'react'

import Inline from '../Shared/Inline'
import * as Store from '../../models/Store/state'
import { Property } from '../../models'
import Link from '../Shared/Link'

export default function ({ id }: { id: number }) {
  return (
    <Link<Property>
      id={id}
      find={Store.property}
      path={(uid: string) => `/properties/${uid}`}
      contents={(property: Property) => <Inline body={property.name} />}
      kind="Property"
    />
  )
}