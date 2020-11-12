import * as F from '@pi-base/core/lib/Formula'

import Collection from './Collection'
import type { Formula, Property, Space, Trait } from '../models'

export default class Traits {
  private traits: Map<string, Trait>
  private spaces: Collection<Space>
  private properties: Collection<Property>

  static build(
    traits: Trait[] = [],
    spaces: Collection<Space> = Collection.empty(),
    properties: Collection<Property> = Collection.empty(),
  ): Traits {
    return new Traits(traits, spaces, properties)
  }

  static empty() {
    return new Traits()
  }

  constructor(
    traits: Trait[] = [],
    spaces: Collection<Space> = Collection.empty(),
    properties: Collection<Property> = Collection.empty(),
  ) {
    this.traits = new Map(
      traits.map((t) => [this.traitId(t.space, t.property), t]),
    )
    this.spaces = spaces
    this.properties = properties
  }

  add(traits: Trait[]): Traits {
    return new Traits(
      [...this.traits.values(), ...traits],
      this.spaces,
      this.properties,
    )
  }

  find(space: Space, property: Property) {
    return this.traits.get(this.traitId(space.id, property.id))
  }

  forProperty(property: Property): [Space, Trait][] {
    return this.collect(this.spaces, (space) => this.find(space, property))
  }

  forSpace(space: Space): [Property, Trait][] {
    return this.collect(this.properties, (property) =>
      this.find(space, property),
    )
  }

  get all(): Trait[] {
    return [...this.traits.values()]
  }

  get size() {
    return this.traits.size
  }

  evaluate({ formula, space }: { formula: Formula<Property>; space: Space }) {
    const traits = new Map(
      this.forSpace(space).map(([property, trait]) => [
        property.id,
        trait.value,
      ]),
    )
    const mapped = F.mapProperty((p) => p.id, formula)
    return F.evaluate(mapped, traits)
  }

  isCounterexample(
    { when, then }: { when: Formula<Property>; then: Formula<Property> },
    space: Space,
  ): boolean {
    return (
      this.evaluate({
        formula: F.and(when, F.negate(then)),
        space,
      }) === true
    )
  }

  private traitId(space: number, property: number) {
    return `${space}.${property}`
  }

  private collect<T>(
    collection: Collection<T>,
    lookup: (item: T) => Trait | undefined,
  ): [T, Trait][] {
    const result: [T, Trait][] = []
    collection.all.forEach((item) => {
      const trait = lookup(item)
      if (trait) {
        result.push([item, trait])
      }
    })
    return result
  }
}
