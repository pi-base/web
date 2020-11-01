import type { Theorem as BTheorem } from '@pi-base/core'

import { index } from '../stores/collection'
import type { Data, Property, Theorem } from '../types'
import { hydrate } from '../util'

export default class Theorems {
  private theorems: Map<string, Theorem>
  static fromData(data: Data | undefined): Theorems {
    if (data) {
      return new Theorems(data.theorems, data.properties)
    } else {
      return new Theorems([], [])
    }
  }

  constructor(theorems: BTheorem[], properties: Property[]) {
    const ix = index(properties, (p) => p.uid)

    this.theorems = new Map()
    theorems.forEach((t) => {
      const hydrated = hydrate(t, ix)
      if (hydrated) {
        this.theorems.set(t.uid, hydrated)
      }
    })
  }

  find(uid: string) {
    return this.theorems.get(uid) || null
  }

  get all() {
    return Array.from(this.theorems.values())
  }
}
