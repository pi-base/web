import { properties } from '../Formula'
import { union } from '../Util'

import { Id, Implication } from './Types'

export default class ImplicationIndex<
  TheoremId = Id,
  PropertyId = Id,
  Theorem extends Implication<TheoremId, PropertyId> = Implication<
    TheoremId,
    PropertyId
  >
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
    this.byProperty = new Map()

    implications.forEach((i: Theorem) => {
      ImplicationIndex.properties(i).forEach((id: PropertyId) => {
        if (!this.byProperty.has(id)) {
          this.byProperty.set(id, new Set())
        }
        this.byProperty.get(id)!.add(i)
      })
    })
  }

  withProperty(id: PropertyId): Set<Theorem> {
    return this.byProperty.get(id) || new Set<Theorem>()
  }
}
