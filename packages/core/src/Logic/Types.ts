import * as F from '../Formula'

export type Id = string

export type Evidence = {
  theorem: Id,
  properties: Id[]
} | 'given'

export type Formula = F.Formula<Id>

export interface Implication {
  uid: string
  when: Formula
  then: Formula
}

export type Proof = {
  theorems: Id[]
  properties: Id[]
}
