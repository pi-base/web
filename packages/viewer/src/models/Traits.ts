import type { Data, Property, Space, Trait } from '../types'
import { Id } from '../models'

export default class Traits {
  private traits: Map<string, Trait>
  private spaces: Map<number, Space>
  private properties: Map<number, Property>

  static fromData(data: Data | undefined): Traits {
    if (data) {
      return new Traits(data.traits, data.spaces, data.properties)
    } else {
      return new Traits([], [], [])
    }
  }

  constructor(traits: Trait[], spaces: Space[], properties: Property[]) {
    this.traits = new Map(
      traits.map((t) => [this.traitId(t.space, t.property), t]),
    )
    this.spaces = new Map(spaces.map((s) => [Id.toInt(s.uid), s]))
    this.properties = new Map(properties.map((p) => [Id.toInt(p.uid), p]))
  }

  find(space: Space, property: Property) {
    return this.traits.get(this.traitId(space.uid, property.uid))
  }

  forProperty(property: Property): [Space, Trait][] {
    return Array.from(this.spaces.values()).reduce(
      (acc: [Space, Trait][], space: Space) => {
        const trait = this.find(space, property)
        return trait ? [...acc, [space, trait] as [Space, Trait]] : acc
      },
      [],
    )
  }

  forSpace(space: Space): [Property, Trait][] {
    return Array.from(this.properties.values()).reduce(
      (acc: [Property, Trait][], property: Property) => {
        const trait = this.find(space, property)
        return trait ? [...acc, [property, trait] as [Property, Trait]] : acc
      },
      [],
    )
  }

  get size() {
    return this.traits.size
  }

  private traitId(space: string, property: string) {
    return `${Id.toInt(space)}.${Id.toInt(property)}`
  }
}
