import type { Ref, Theorem as BTheorem } from '@pi-base/core'
import * as F from '@pi-base/core/lib/Formula'

import type { Property } from '../types'

export default class Theorem {
  static hydrate(
    base: BTheorem,
    lookup: (uid: string) => Property | undefined,
  ): Theorem | undefined {
    const { when, then, ...rest } = base

    const ant = F.compact(F.mapProperty(lookup, when))
    const con = F.compact(F.mapProperty(lookup, then))
    if (!ant || !con) {
      return undefined
    }

    return new Theorem({
      when: ant,
      then: con,
      ...rest,
    })
  }

  readonly uid: string
  readonly when: F.Formula<Property>
  readonly then: F.Formula<Property>
  readonly description: string
  readonly refs: Ref[]

  constructor({
    uid,
    when,
    then,
    description,
    refs,
  }: {
    uid: string
    when: F.Formula<Property>
    then: F.Formula<Property>
    description: string
    refs: Ref[]
  }) {
    this.uid = uid
    this.when = when
    this.then = then
    this.description = description
    this.refs = refs
  }

  get name() {
    const ant = F.render(this.when, (p) => p.name)
    const con = F.render(this.then, (p) => p.name)

    return `${ant} ⇒ ${con}`
  }
}
