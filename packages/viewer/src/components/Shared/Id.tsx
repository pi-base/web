import React from 'react'

import { Tagged as tagged, trim } from '@pi-base/core/lib/Id'
export type Tagged = tagged

export { expand, tag } from '@pi-base/core/lib/Id'

export default function Id({ value }: { value: string }) {
  return <>{trim(value)}</>
}