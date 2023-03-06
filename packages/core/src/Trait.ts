import { Id as BaseId } from './Id.js'
import { Record } from './Record.js'

export type Proof<Id = BaseId> = {
  theorems: Id[]
  properties: Id[]
}

export type Trait<Id = BaseId> = Record & {
  space: Id
  property: Id
  value: boolean
  proof?: Proof<Id>
}
