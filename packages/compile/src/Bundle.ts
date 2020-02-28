type RefKind = {doi: string} | {wikipedia: string} | {mr: string}
export type Ref = {name: string} & RefKind

type Record = {
  uid: string
  counterexamples_id: string | undefined
  description: string
  refs: Ref[]
}

export type Property = Record & {
  name: string
  slug: string | undefined
  aliases: string[]
}

export type Space = Record & {
  name: string
  slug: string | undefined
  aliases: string[]
}

export type Theorem = Record & {
  if_: any
  then: any
}

export type Trait = Record & {
  space: string
  property: string
  value: boolean
}

export interface BuildError {
  asJSON: () => any
}

export function build(
  properties: Property[],
  spaces: Space[],
  theorems: Theorem[],
  traits: Trait[]
): Bundle | BuildError {
  return new Bundle(properties, spaces, theorems, traits)
}

export class Bundle {
  _properties: Property[]
  _spaces: Space[]
  _traits: Trait[]
  _theorems: Theorem[]

  constructor(
    properties: Property[],
    spaces: Space[],
    theorems: Theorem[],
    traits: Trait[]
  ) {
    this._properties = properties
    this._spaces = spaces
    this._traits = traits
    this._theorems = theorems
  }

  asJSON() {
    const json = {
      properties: this._properties,
      spaces: this._spaces,
      theorems: this._theorems.map(serializeTheorem),
      traits: this._traits
    }

    return json
  }
}

function serializeTheorem(theorem: Theorem) {
  const {if_, ...rest} = theorem
  return {if: if_, ...rest}
}
