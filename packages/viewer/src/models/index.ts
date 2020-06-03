import * as P from '@pi-base/core'
import store from './Store'
import { Proof, Search as search } from './Store/state'

export const Store = store
export const useStore = Store.useStore

export type Formula = P.Formula<Property>
export type Property = P.Property
export type Search = search
export type Space = P.Space
export type Theorem = P.Theorem
export type Trait = P.Trait & { proof?: Proof }
