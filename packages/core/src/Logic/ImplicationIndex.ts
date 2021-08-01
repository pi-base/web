import { properties } from '../Formula'
import { union } from '../Util'

import { Id, Implication } from './Types'

export default class ImplicationIndex<
  TheoremId = Id,
  PropertyId = Id,
  Theorem extends Implication<TheoremId, PropertyId> = Implication<
    TheoremId,
    PropertyId
  >,
> {
  all: Theorem[]
  private byProperty: Map<PropertyId, Set<Theorem>>

  static properties<TheoremId, PropertyId>(
    implication: Implication<TheoremId, PropertyId>,
  ): Set<PropertyId> {
    return union(properties(implication.when), properties(implication.then))
  }

  constructor(implications: Theorem[]) {
    this.all = implications
    this.byProperty = new Map<PropertyId, Set<Theorem>>()

    implications.forEach((i: Theorem) => {
      ImplicationIndex.properties(i).forEach((id: PropertyId) => {
        let collection = this.byProperty.get(id)
        if (!collection) {
          collection = new Set<Theorem>()
          this.byProperty.set(id, collection)
        }
        collection.add(i)
      })
    })
  }

  withProperty(id: PropertyId): Set<Theorem> {
    return this.byProperty.get(id) || new Set<Theorem>()
  }
}
