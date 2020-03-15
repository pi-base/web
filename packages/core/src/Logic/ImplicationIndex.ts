import { properties } from '../Formula'
import { union } from '../Util'

import { Id, Implication } from './Types'

export default class ImplicationIndex {
  all: Implication[]
  private byProperty: Map<Id, Set<Implication>>

  static properties(implication: Implication) {
    return union(
      properties(implication.when),
      properties(implication.then)
    )
  }

  constructor(implications: Implication[]) {
    this.all = implications
    this.byProperty = new Map()

    implications.forEach((i: Implication) => {
      ImplicationIndex.properties(i).forEach((id: Id) => {
        if (!this.byProperty.has(id)) { this.byProperty.set(id, new Set()) }
        this.byProperty.get(id)!.add(i)
      })
    })
  }

  withProperty(id: Id) {
    return this.byProperty.get(id) || []
  }
}