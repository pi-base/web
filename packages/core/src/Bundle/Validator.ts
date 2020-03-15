import Bundle from '../Bundle'
import { Space } from '../Space'
import { Theorem } from '../Theorem'
import { Trait } from '../Trait'
import ImplicationIndex from '../Logic/ImplicationIndex'
import Universe from '../Logic/Universe'

type Id = string
type Message = string

export class Errors {
  private spaces: Map<Id, Message[]>
  private theorems: Map<Id, Message[]>
  private traits: Map<[Id, Id], Message[]>

  constructor() {
    this.spaces = new Map()
    this.theorems = new Map()
    this.traits = new Map()
  }

  any() {
    return this.spaces.size > 0 || this.traits.size > 0 || this.theorems.size > 0
  }

  space(space: Space, error: Message) {
    this.add(this.spaces, space.uid, error)
  }

  theorem(theorem: Theorem, error: Message) {
    this.add(this.theorems, theorem.uid, error)
  }

  trait(trait: Trait, error: Message) {
    this.add(this.traits, [trait.space, trait.property], error)
  }

  toJSON() {
    const result: any = {}

    if (this.spaces.size > 0) { result.spaces = this.spaces }
    if (this.theorems.size > 0) { result.theorems = this.theorems }
    if (this.traits.size > 0) { result.traits = this.traits }

    return result
  }

  private add<K, V>(map: Map<K, V[]>, key: K, value: V) {
    if (!map.has(key)) { map.set(key, []) }
    map.get(key)!.push(value)
  }
}

export default class Validator {
  private bundle: Bundle
  private universe: Universe

  constructor(bundle: Bundle) {
    this.bundle = bundle
    this.universe = Universe.fromBundle(bundle)
  }

  run() {
    const errors = new Errors()

    // Trait references
    this.bundle.traits.forEach((trait: Trait) => {
      if (!this.bundle.space(trait.space)) {
        errors.trait(trait, `Missing space: ${trait.space}`)
      }
      if (!this.bundle.property(trait.space)) {
        errors.trait(trait, `Missing space: ${trait.space}`)
      }
    })

    // Theorem references
    const propertyIds = new Set(this.bundle.properties.keys())
    this.bundle.theorems.forEach((theorem: Theorem) => {
      const missing = ImplicationIndex.properties(theorem)
      propertyIds.forEach((id: Id) => missing.delete(id))
      if (missing.size === 1) {
        errors.theorem(theorem, `Missing property: ${missing}`)
      } else if (missing.size > 0) {
        errors.theorem(theorem, `Missing properties: ${Array.from(missing).sort().join(', ')}`)
      }
    })

    // Trait consistency
    this.bundle.spaces.forEach((space: Space) => {
      const contradiction = this.universe.contradiction(space)
      if (contradiction) {
        errors.space(space, `Contradiction: theorems ${contradiction.theorems.join(', ')} and properties ${contradiction.properties.join(', ')}`)
      }
    })

    return errors
  }
}

export function run(bundle: Bundle) {
  const errors = new Validator(bundle).run()
  if (errors.any()) { return errors.toJSON() }
}

