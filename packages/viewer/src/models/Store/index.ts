import {
  Proof as proof,
  Search as search,
  SearchResults as searchResults,
  Status as status,
  Store as store,
  properties,
  property,
  space,
  spaces,
  theorem,
  theorems,
  trait,
} from './state'

// It seems like there should be an easier way to re-export a type from a submodule ...
export type Proof = proof
export type Search = search
export type SearchResults = searchResults
export type Status = status
export type Store = store

export {
  Provider,
  useStore,
} from './context'

export {
  MAIN_BRANCH,
  defaultHost,
  initial,
  loaded,
  resolveProperty,
  search,
  searchProperties,
  spacesMatching,
  status,
  theoremIndex,
  theoremsWithCounterexample,
  theoremsWithProperty,
  trait,
  traitsForProperty,
  traitsForSpace,
  uncheckedSpaces,
} from './state'

export {
  load,
  save,
} from './storage'

// These selectors often conflict with local variables.
// This export provides an easy way to import them namespaced.
export default {
  properties,
  property,
  space,
  spaces,
  theorem,
  theorems,
  trait,
}
