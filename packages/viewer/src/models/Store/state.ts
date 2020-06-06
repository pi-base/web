import Fuse from 'fuse.js'
import { createSelector } from 'reselect'

import {
  bundle as B,
  defaultHost as bundleDefaultHost,
  disprove,
  formula as F,
  traitId,
  Bundle,
  Formula,
  Id,
  ImplicationIndex,
  Property,
  Space,
  Theorem,
  Trait,
  TraitId
} from '@pi-base/core'

export type Proof = {
  properties: Id[]
  theorems: Id[]
}

export type Search
  = { kind: 'formula', formula: Formula<Property> }
  | { kind: 'text', text: string }

export type SearchResults
  = { kind: 'spaces', spaces: Space[] }
  | { kind: 'contradiction', contradiction: Theorem[] | 'tautology' }

export type Status
  = { state: 'loading' }
  | { state: 'fetching' }
  | { state: 'checking', complete: number, total: number }
  | { state: 'error', message: string }
  | { state: 'ready' }

export type Store = {
  bundle: Bundle
  etag: string | null
  remote: {
    branch: string
    host: string
    state: 'fetching' | 'done'
    fetched: Date
  }
  checked: Set<Id>
  error: string | null
}

export function status(store: Store): Status {
  if (!loaded(store)) {
    return { state: 'loading' }
  } else if (store.error) {
    return { state: 'error', message: store.error }
  } else if (fetching(store)) {
    return { state: 'fetching' }
  } else if (checking(store)) {
    return {
      state: 'checking',
      complete: store.checked.size,
      total: store.bundle.spaces.size
    }
  } else {
    return { state: 'ready' }
  }
}

export const defaultHost = process.env.REACT_APP_BUNDLE_HOST || bundleDefaultHost

export const initial: Store = {
  bundle: B.deserialize({
    properties: [],
    spaces: [],
    traits: [],
    theorems: [],
    version: { ref: 'master', sha: 'HEAD' }
  }),
  etag: null,
  remote: {
    branch: 'master',
    host: defaultHost,
    state: 'fetching',
    fetched: new Date()
  },
  checked: new Set(),
  error: null
}

export const property = (store: Store, id: Id) => store.bundle.properties.get(id) || null
export const space = (store: Store, id: Id) => store.bundle.spaces.get(id) || null
export const theorem = (store: Store, id: Id) => store.bundle.theorems.get(id) || null
export const trait = (store: Store, id: TraitId) => {
  const uid = traitId(id)
  return store.bundle.traits.get(uid) || null
}

export const properties = createSelector(
  (store: Store) => store.bundle,
  bundle => Array.from(bundle.properties.values())
)

export const spaces = createSelector(
  (store: Store) => store.bundle,
  bundle => Array.from(bundle.spaces.values())
)

export const theorems = createSelector(
  (store: Store) => store.bundle,
  bundle => Array.from(bundle.theorems.values())
)

export const theoremIndex = createSelector(
  theorems,
  implications => new ImplicationIndex(implications)
)

const index = <T>(collection: T[]) => new Fuse(
  collection,
  {
    caseSensitive: false,
    shouldSort: true,
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'aliases', weight: 0.5 },
      { name: 'description', weight: 0.2 },
    ],
    threshold: 0.4
  }
)

export const propertyIndex = createSelector(properties, index)
export const spaceIndex = createSelector(spaces, index)

function spaceTraitMap(store: Store, space: Space) {
  const traits = new Map<Id, boolean>()
  properties(store).forEach((property: Property) => {
    const trait = store.bundle.traits.get(traitId({ space: space.uid, property: property.uid }))
    if (trait) { traits.set(property.uid, trait.value) }
  })
  return traits
}

export function theoremsWithCounterexample(store: Store, space: Space) {
  const traits = spaceTraitMap(store, space)

  return theorems(store).filter((theorem: Theorem) =>
    F.evaluate(theorem.when, traits) === false && F.evaluate(theorem.then, traits) === true
  )
}

export const theoremsWithProperty = (store: Store, property: Property) =>
  Array.from(theoremIndex(store).withProperty(property.uid)) as Theorem[] // TODO: make index generic

export const traitsForProperty = (store: Store, property: Property) => {
  const acc = new Map<Id, { space: Space, trait: Trait }>()
  spaces(store).forEach((space: Space) => {
    const t = trait(store, { space: space.uid, property: property.uid })
    if (t) { acc.set(space.uid, { space, trait: t }) }
  })
  return acc
}

export const traitsForSpace = (store: Store, space: Space) => {
  const acc = new Map<Id, { property: Property, trait: Trait }>()
  properties(store).forEach((property: Property) => {
    const t = trait(store, { space: space.uid, property: property.uid })
    if (t) { acc.set(property.uid, { property, trait: t }) }
  })
  return acc
}

export function resolveProperty(store: Store, term: string) {
  return searchProperties(store, term)[0]
}

function searchIndex<T, O>(
  index: Fuse<T, O>,
  term: string
) {
  return index.search(term).map(r => r.item)
}

export const searchProperties = (store: Store, term: string) => {
  if (!term) { return properties(store) }
  return searchIndex(propertyIndex(store), term)
}

export const searchSpaces = (store: Store, term: string) => {
  if (!term) { return spaces(store) }
  return searchIndex(spaceIndex(store), term)
}

export function spacesMatching(store: Store, formula: Formula<Id>, collection?: Space[]): SearchResults {
  if (!collection) { collection = spaces(store) }

  const results = collection.filter((space: Space) => {
    const traits = spaceTraitMap(store, space)
    return F.evaluate(formula, traits)
  })

  if (results.length > 0) { return { kind: 'spaces', spaces: results } }

  const contradiction = disprove(theoremIndex(store), formula)
  if (contradiction === 'tautology') {
    return { kind: 'contradiction', contradiction: 'tautology' }
  } else if (contradiction) {
    return {
      kind: 'contradiction',
      contradiction: contradiction.map(id => theorem(store, id)!)
    }
  } else {
    return { kind: 'spaces', spaces: [] }
  }
}

export function search(store: Store, search: Search): SearchResults {
  switch (search.kind) {
    case 'formula':
      return spacesMatching(store, F.mapProperty(p => p.uid, search.formula), spaces(store))
    case 'text':
      return { kind: 'spaces', spaces: searchSpaces(store, search.text) }
  }
}

export function uncheckedSpaces(store: Store) {
  return spaces(store).filter(space => !store.checked.has(space.uid))
}

export function loaded(store: Store) {
  return store !== initial
}

function checking(store: Store) {
  return store.bundle.spaces.size > store.checked.size
}

export function fetching(store: Store) {
  return store.remote.state === 'fetching'
}
