import { formula as F } from '@pi-base/core'

import Collection from './Collection'
import { default as Theorem } from './Theorem'
import type { Property, SerializedTheorem } from '@/types'

export default class Theorems {
  static build(
    theorems: SerializedTheorem[] = [],
    properties: Collection<Property> = Collection.empty(),
  ): Theorems {
    const result: Theorem[] = theorems.reduce(
      (acc: Theorem[], t: SerializedTheorem) => {
        const hydrated = Theorem.hydrate(
          t,
          p => properties.find(p) || undefined,
        )
        return hydrated ? [...acc, hydrated] : acc
      },
      [],
    )
    return new this(result)
  }

  private theorems: Collection<Theorem>

  constructor(theorems: Theorem[] = []) {
    this.theorems = Collection.byId(theorems)
  }

  forProperty(property: Property) {
    return this.theorems.all.filter(
      ({ when, then }) =>
        F.properties(when).has(property) || F.properties(then).has(property),
    )
  }

  get all() {
    return this.theorems.all
  }

  find(i: string | number) {
    return this.theorems.find(i)
  }
}
