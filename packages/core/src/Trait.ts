import { Id as BaseId } from './Id'
import { Record } from './Record'

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
