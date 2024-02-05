import { formula as F } from '@pi-base/core'

import Collection from './Collection'
import type {
  Formula,
  Proof,
  Property,
  Space,
  SerializedProof,
  Theorem,
  Theorems,
  Trait,
} from '@/models'

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
      traits.map(t => [this.traitId(t.space, t.property), t]),
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
    return this.collect(this.spaces, space => this.find(space, property))
  }

  forPropertyAll(property: Property): [Space, Trait | undefined][] {
    return this.collectAll(this.spaces, space => this.find(space, property))
  }

  forSpace(space: Space): [Property, Trait][] {
    return this.collect(this.properties, property => this.find(space, property))
  }

  forSpaceAll(space: Space): [Property, Trait | undefined][] {
    return this.collectAll(this.properties, property =>
      this.find(space, property),
    )
  }

  lookup({
    spaceId,
    propertyId,
    spaces,
    properties,
    theorems,
  }: {
    spaceId: string
    propertyId: string
    spaces: Collection<Space>
    properties: Collection<Property>
    theorems: Theorems
  }) {
    const space = spaces.find(spaceId)
    if (!space) {
      return null
    }

    const property = properties.find(propertyId)
    if (!property) {
      return null
    }

    const trait = this.find(space, property)
    if (!trait) {
      return null
    }

    const proof = trait.asserted
      ? undefined
      : this.proof(space, trait.proof, theorems)
    const meta = trait.asserted
      ? { description: trait.description, refs: trait.refs }
      : undefined

    return {
      property,
      space,
      trait,
      proof,
      meta,
    }
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
    const mapped = F.mapProperty(p => p.id, formula)
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

  proof(space: Space, proof: SerializedProof, ts: Theorems): Proof | undefined {
    const traits: [Property, Trait][] = []
    const theorems: Theorem[] = []

    for (const pid of proof.properties) {
      const p = this.properties.find(pid)
      if (!p) {
        return
      }
      const t = this.find(space, p)
      if (!t) {
        return
      }

      traits.push([p, t])
    }

    for (const tid of proof.theorems) {
      const t = ts.find(tid)
      if (!t) {
        return
      }
      theorems.push(t)
    }

    return {
      traits,
      theorems,
    }
  }

  private traitId(space: number, property: number) {
    return `${space}.${property}`
  }

  private collect<T>(
    collection: Collection<T>,
    lookup: (item: T) => Trait | undefined,
  ): [T, Trait][] {
    const result: [T, Trait][] = []
    collection.all.forEach(item => {
      const trait = lookup(item)
      if (trait) {
        result.push([item, trait])
      }
    })
    return result
  }

  private collectAll<T>(
    collection: Collection<T>,
    lookup: (item: T) => Trait | undefined,
  ): [T, Trait | undefined][] {
    const result: [T, Trait | undefined][] = []
    collection.all.forEach(item => {
      const trait = lookup(item)
      result.push([item, trait])
    })
    return result
  }
}
