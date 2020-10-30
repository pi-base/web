import type { Theorem as BTheorem } from '@pi-base/core'
import type { Collection } from './stores'
import type { Property, Theorem } from './types'

import * as F from '@pi-base/core/lib/Formula'

export function hydrate(
  theorem: BTheorem,
  properties: Collection<Property, string>,
): Theorem | undefined {
  const { when, then, ...rest } = theorem

  const ant = F.compact(
    F.mapProperty((p) => properties.find(p) || undefined, when),
  )
  const con = F.compact(
    F.mapProperty((p) => properties.find(p) || undefined, then),
  )
  if (!ant || !con) {
    return undefined
  }

  const name = `${F.render(ant, (p) => p.name)} ⇒ ${F.render(
    con,
    (p) => p.name,
  )}`

  return {
    name,
    when: ant,
    then: con,
    ...rest,
  }
}

export function idToInt(id: string) {
  return parseInt(id.slice(1))
}
