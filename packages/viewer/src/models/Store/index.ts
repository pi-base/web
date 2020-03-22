import { Provider, useStore } from './context'
import {
  Status as status,
  Store as store,
  initial,
  properties,
  property,
  propertyIndex,
  resolveProperty,
  search,
  searchProperties,
  searchSpaces,
  space,
  spaceIndex,
  spacesMatching,
  spaces,
  theorem,
  theorems,
  theoremsWithCounterexample,
  theoremsWithProperty,
  trait,
  traitsForProperty,
  traitsForSpace
} from './state'

export type Status = status
export type Store = store

export {
  initial,
  properties,
  property,
  propertyIndex,
  resolveProperty,
  search,
  searchProperties,
  searchSpaces,
  space,
  spaceIndex,
  spacesMatching,
  spaces,
  theorem,
  theorems,
  theoremsWithCounterexample,
  theoremsWithProperty,
  trait,
  traitsForProperty,
  traitsForSpace
} from './state'

export default {
  Provider,
  initial,
  properties,
  property,
  propertyIndex,
  resolveProperty,
  search,
  searchProperties,
  searchSpaces,
  space,
  spaces,
  spaceIndex,
  spacesMatching,
  theorem,
  theorems,
  theoremsWithCounterexample,
  theoremsWithProperty,
  trait,
  traitsForProperty,
  traitsForSpace,
  useStore
}
