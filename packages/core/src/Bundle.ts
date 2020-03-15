import { Property } from './Property'
import { Space } from './Space'
import { Theorem } from './Theorem'
import { Trait } from './Trait'

type Id = string

export type Version = {
  ref: string
  sha: string
}

export default class Bundle {
  properties: Map<Id, Property>
  spaces: Map<Id, Space>
  traits: Trait[]
  theorems: Theorem[]
  version: Version

  constructor(
    properties: Property[],
    spaces: Space[],
    theorems: Theorem[],
    traits: Trait[],
    version: Version
  ) {
    this.properties = new Map(properties.map((property: Property) => [property.uid, property]))
    this.spaces = new Map(spaces.map((space: Space) => [space.uid, space]))
    this.traits = traits
    this.theorems = theorems
    this.version = version
  }

  property(id: Id) {
    return this.properties.get(id)
  }

  space(id: Id) {
    return this.spaces.get(id)
  }
}
