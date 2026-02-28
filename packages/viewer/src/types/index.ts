export type { Formula, TruthValue } from '@pi-base/core'
import type { Formula, Ref as R, TruthValue } from '@pi-base/core'

export type Ref = R.Ref

export type Property = {
  id: number
  name: string
  aliases: string[]
  description: string
  refs: Ref[]
}

export type Space = {
  id: number
  name: string
  aliases: string[]
  description: string
  refs: Ref[]
}

export type AssertedTrait = {
  asserted: true
  space: number
  property: number
  value: TruthValue
  description: string
  refs: Ref[]
}

export type DeducedTrait = {
  asserted: false
  space: number
  property: number
  value: TruthValue
  proof: {
    properties: number[]
    theorems: number[]
  }
}

export type Trait = AssertedTrait | DeducedTrait

export type SerializedProof = {
  properties: number[]
  theorems: number[]
}

export type Source = {
  host: string
  branch: string
}
