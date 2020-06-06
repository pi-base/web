import * as P from '@pi-base/core'
import store from './Store'
import { Search as search } from './Store'

export { useStore } from './Store'

export const Store = store

export type Formula = P.Formula<Property>
export type Property = P.Property
export type Search = search
export type Space = P.Space
export type Theorem = P.Theorem
export type Trait = P.Trait
