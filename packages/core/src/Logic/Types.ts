import type { Formula } from '../Formula'

export type Id = string

export interface Implication<TheoremId = Id, PropertyId = Id> {
  id: TheoremId
  when: Formula<PropertyId>
  then: Formula<PropertyId>
}
