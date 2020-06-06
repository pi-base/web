import { Provider, useStore } from './context'
import {
  Status as status,
  Store as store,
  initial,
  loaded,
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
  fetching,
  loaded,
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
  status,
  theorem,
  theorems,
  theoremsWithCounterexample,
  theoremsWithProperty,
  trait,
  traitsForProperty,
  traitsForSpace,
  uncheckedSpaces
} from './state'

export default {
  Provider,
  initial,
  loaded,
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
