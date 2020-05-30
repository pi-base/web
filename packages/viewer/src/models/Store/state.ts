import Fuse from 'fuse.js'
import { createSelector } from 'reselect'

import {
  disprove,
  formula as F,
  Formula,
  Id,
  ImplicationIndex,
  Property,
  Prover,
  Space,
  Theorem,
  Trait,
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
  = { state: 'fetching' }
  | { state: 'loading' }
  | { state: 'checking', complete: number, total: number }
  | { state: 'ready' }

export type Store = {
  properties: Map<Id, Property>
  spaces: Map<Id, Space>
  theorems: Map<Id, Theorem>
  traits: Map<Id, Trait & { proof?: Proof }> // TODO: union type?
  version: {
    ref: string
    sha: string
  }
  checked: Set<Id>
}

export const initial: Store = {
  properties: new Map(),
  spaces: new Map(),
  theorems: new Map(),
  traits: new Map(),
  version: { ref: 'master', sha: 'HEAD' },
  checked: new Set()
}

type TraitId = { space: Id, property: Id }
export const traitId = ({ space, property }: TraitId) => `${space}|${property}`

export const property = (store: Store, id: Id) => store.properties.get(id) || null
export const space = (store: Store, id: Id) => store.spaces.get(id) || null
export const theorem = (store: Store, id: Id) => store.theorems.get(id) || null
export const trait = (store: Store, id: TraitId) => store.traits.get(traitId(id)) || null

export const properties = createSelector(
  (store: Store) => store.properties,
  properties => Array.from(properties.values())
)

export const spaces = createSelector(
  (store: Store) => store.spaces,
  spaces => Array.from(spaces.values())
)

export const theorems = createSelector(
  (store: Store) => store.theorems,
  theorems => Array.from(theorems.values())
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
  store.properties.forEach((property: Property) => {
    const trait = store.traits.get(traitId({ space: space.uid, property: property.uid }))
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
  store.spaces.forEach((space: Space) => {
    const trait = store.traits.get(traitId({ space: space.uid, property: property.uid }))
    if (trait) { acc.set(space.uid, { space, trait }) }
  })
  return acc
}

export const traitsForSpace = (store: Store, space: Space) => {
  const acc = new Map<Id, { property: Property, trait: Trait }>()
  store.properties.forEach((property: Property) => {
    const trait = store.traits.get(traitId({ space: space.uid, property: property.uid }))
    if (trait) { acc.set(property.uid, { property, trait }) }
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

export function check(store: Store, space: Space) {
  if (store.checked.has(space.uid)) { return }

  const lookup = new Map()
  properties(store).forEach((property: Property) => {
    const trait = store.traits.get(traitId({ space: space.uid, property: property.uid }))
    if (trait) { lookup.set(property.uid, trait.value) }
  })

  const prover = new Prover(theoremIndex(store), lookup)
  const result = prover.derivations()

  store.checked.add(space.uid)
  if (result.proofs) {
    result.proofs.forEach(({ property, value, proof }) => {
      const uid = traitId({ space: space.uid, property })
      store.traits.set(uid, {
        uid,
        space: space.uid,
        property,
        value,
        counterexamples_id: undefined,
        description: '',
        refs: [],
        proof: proof
      })
    })
  } else {
    // TODO: handle result.contradiction
    console.log(result)
  }
}
