import { formula as F } from '@pi-base/core'

import type { Property, Ref, SerializedTheorem } from '@/models'

export default class Theorem {
  static hydrate(
    base: SerializedTheorem,
    lookup: (id: number) => Property | undefined,
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

  readonly id: number
  readonly when: F.Formula<Property>
  readonly then: F.Formula<Property>
  readonly description: string
  readonly refs: Ref[]

  constructor({
    id,
    when,
    then,
    description = '',
    refs = [],
  }: {
    id: number
    when: F.Formula<Property>
    then: F.Formula<Property>
    description?: string
    refs?: Ref[]
  }) {
    this.id = id
    this.when = when
    this.then = then
    this.description = description
    this.refs = refs
  }

  get name() {
    const ant = F.render(this.when, p => p.name)
    const con = F.render(this.then, p => p.name)

    return `${ant} ⇒ ${con}`
  }

  get properties() {
    const set = F.properties(this.when)
    F.properties(this.then).forEach(p => set.add(p))
    return [...set]
  }

  get converse(): Theorem {
    return {
      ...this,
      when: this.then,
      then: this.when,
    }
  }
}
