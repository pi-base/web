import { Property } from './Property'
import { Space } from './Space'
import { Theorem } from './Theorem'
import { Trait } from './Trait'

export type Version = {
  ref: string
  sha: string
}

export class Bundle {
  _properties: Property[]
  _spaces: Space[]
  _traits: Trait[]
  _theorems: Theorem[]
  _version: Version

  constructor(
    properties: Property[],
    spaces: Space[],
    theorems: Theorem[],
    traits: Trait[],
    version: Version
  ) {
    this._properties = properties
    this._spaces = spaces
    this._traits = traits
    this._theorems = theorems
    this._version = version
  }
}
