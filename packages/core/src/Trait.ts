import { Id } from './Id'
import { Record } from './Record'

export type Proof = {
  theorems: Id[]
  properties: Id[]
}

export type Trait = Record & {
  space: string
  property: string
  value: boolean
  proof?: Proof
}