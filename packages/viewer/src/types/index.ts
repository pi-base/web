import type { Formula, Ref } from '@pi-base/core'
export type { Formula, Ref } from '@pi-base/core'

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
  value: boolean
  description: string
  refs: Ref[]
}

export type DeducedTrait = {
  asserted: false
  space: number
  property: number
  value: boolean
  proof: {
    properties: number[]
    theorems: number[]
  }
}

export type Trait = AssertedTrait | DeducedTrait

export type SerializedTheorem = {
  id: number
  when: Formula<number>
  then: Formula<number>
  description: string
  refs: Ref[]
}

export type SerializedProof = {
  properties: number[]
  theorems: number[]
}

export type Source = {
  host: string
  branch: string
}
