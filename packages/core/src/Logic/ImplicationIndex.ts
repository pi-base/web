import { properties } from '../Formula'
import { union } from '../Util'

import { Id, Implication } from './Types'

export default class ImplicationIndex<T extends Implication>{
  all: T[]
  private byProperty: Map<Id, Set<T>>

  static properties(implication: Implication) {
    return union(
      properties(implication.when),
      properties(implication.then)
    )
  }

  constructor(implications: T[]) {
    this.all = implications
    this.byProperty = new Map()

    implications.forEach((i: T) => {
      ImplicationIndex.properties(i).forEach((id: Id) => {
        if (!this.byProperty.has(id)) { this.byProperty.set(id, new Set()) }
        this.byProperty.get(id)!.add(i)
      })
    })
  }

  withProperty(id: Id) {
    return this.byProperty.get(id) || new Set<T>()
  }
}