import type { Formula } from '../Formula.js'

export type Id = string

export interface Implication<TheoremId = Id, PropertyId = Id> {
  id: TheoremId
  when: Formula<PropertyId>
  then: Formula<PropertyId>
}
