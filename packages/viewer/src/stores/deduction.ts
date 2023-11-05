import { type Readable, writable } from 'svelte/store'
import {
  ImplicationIndex,
  deduceTraits,
  disproveFormula,
  proveTheorem,
} from '@pi-base/core'
import { formula as F } from '@pi-base/core'
import type {
  Collection,
  DeducedTrait,
  Formula,
  Property,
  Space,
  Theorem,
  Theorems,
  Trait,
  Traits,
} from '@/models'
import { eachTick, read, subscribeUntil } from '@/util'

export type State = {
  checked: Set<number>
  all: Set<number>
  contradiction?: {
    properties: number[]
    theorems: number[]
  }
}

export type Store = Readable<State> & {
  checked(spaceId: number): Promise<void>
  run(reset?: boolean): void
  prove(theorem: Theorem): Theorem[] | 'tautology' | null
}

export const initial: State = {
  checked: new Set(),
  all: new Set(),
}

function indexTheorems(theorems: Theorems): ImplicationIndex<number, number> {
  return new ImplicationIndex<number, number>(
    theorems.all.map(({ id, when, then }) => ({
      id,
      when: F.mapProperty(p => p.id, when),
      then: F.mapProperty(p => p.id, then),
    })),
  )
}

export function disprove(
  store: Readable<Theorems>,
  formula: Formula<Property>,
): Theorem[] | 'tautology' | null {
  const collection = read(store)
  const proof = disproveFormula(
    indexTheorems(collection),
    F.mapProperty(p => p.id, formula),
  )

  return loadProof(collection, proof)
}

function initialize(spaces: Collection<Space>): State {
  return {
    checked: new Set(),
    all: new Set(spaces.all.map(s => s.id)),
  }
}

export function create(
  initial: State | undefined,
  spaces: Readable<Collection<Space>>,
  traits: Readable<Traits>,
  theorems: Readable<Theorems>,
  addTraits: (traits: Trait[]) => void,
): Store {
  const store = writable<State>(initial || initialize(read(spaces)))

  let implications: ImplicationIndex<number, number>

  theorems.subscribe($theorems => {
    implications = indexTheorems($theorems)

    // Ensure that the trait store is updated before deductions run
    setTimeout(run, 0)
  })

  function run(reset = false) {
    if (reset) {
      store.set(initialize(read(spaces)))
    }

    const allSpaces = read(spaces).all

    store.update(s => ({
      ...s,
      all: new Set([...s.all, ...allSpaces.map(s => s.id)]),
    }))

    const checked = read(store).checked

    const unchecked: Space[] = []
    allSpaces.forEach(s => {
      if (!checked.has(s.id)) {
        unchecked.push(s)
      }
    })

    eachTick(unchecked, (s: Space, halt: () => void) => {
      store.update(state => ({ ...state, checking: s.name }))

      const map = new Map(
        read(traits)
          .forSpace(s)
          .map(([p, t]) => [p.id, t.value]),
      )
      const result = deduceTraits(implications, map)

      if (result.kind === 'contradiction') {
        store.update(s => ({ ...s, contradiction: result.contradiction }))
        halt()
        return
      }

      const newTraits: DeducedTrait[] = result.derivations
        .all()
        .map(({ property, value, proof }) => ({
          asserted: false,
          space: s.id,
          property,
          value,
          proof,
        }))

      addTraits(newTraits)

      store.update(state => ({
        ...state,
        checked: new Set([...state.checked, s.id]),
      }))
    })
  }

  return {
    subscribe: store.subscribe,
    run,
    checked(spaceId: number) {
      return subscribeUntil(
        store,
        state => state.checked.has(spaceId) || !!state.contradiction,
      )
    },
    prove(theorem: Theorem) {
      const proof = proveTheorem(
        implications,
        F.mapProperty(p => p.id, theorem.when),
        F.mapProperty(p => p.id, theorem.then),
      )
      return loadProof(read(theorems), proof)
    },
  }
}

function loadProof(
  theorems: Theorems,
  proof: number[] | 'tautology' | null | undefined,
): Theorem[] | 'tautology' | null {
  if (proof === 'tautology') {
    return proof
  } else if (!proof) {
    return null
  }

  const seen = new Set<number>()
  const result: Theorem[] = []

  for (const id of proof) {
    if (!seen.has(id)) {
      const theorem = theorems.find(id)
      if (!theorem) {
        return null
      }
      result.push(theorem)
    }
  }

  return result
}
