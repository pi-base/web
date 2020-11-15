import { Readable, writable } from 'svelte/store'
import { ImplicationIndex, Prover, disprove } from '@pi-base/core'
import type { Proof } from '@pi-base/core/lib/Logic/Types'
import * as F from '@pi-base/core/lib/Formula'
import type {
  Collection,
  DeducedTrait,
  Property,
  Space,
  Theorem,
  Theorems,
  Trait,
  Traits,
} from '../models'
import { eachTick, read, subscribeUntil } from '../util'

export type State = {
  checked: Set<number>
  all: Set<number>
  contradiction?: Proof
}

export type Store = Readable<State> & {
  checked(spaceId: number): Promise<void>
  run(): void
}

export const initial: State = {
  checked: new Set(),
  all: new Set(),
}

function indexTheorems(theorems: Theorems) {
  return new ImplicationIndex(
    // TODO: core shouldn't assume ids are strings
    theorems.all.map(({ id, when, then }) => ({
      uid: id.toString(),
      when: F.mapProperty((p) => p.id.toString(), when),
      then: F.mapProperty((p) => p.id.toString(), then),
    })),
  )
}

export function check(
  store: Readable<Theorems>,
  formula: F.Formula<Property>,
): Theorem[] | 'tautology' | null {
  const collection = read(store)
  const proof = disprove(
    indexTheorems(collection),
    F.mapProperty((p) => p.id.toString(), formula),
  )

  if (proof === 'tautology') {
    return proof
  } else if (!proof) {
    return null
  }

  return proof.map((uid) => collection.find(uid)!)
}

export function create(
  spaces: Readable<Collection<Space>>,
  traits: Readable<Traits>,
  theorems: Readable<Theorems>,
  addTraits: (traits: Trait[]) => void,
): Store {
  const { set, subscribe, update } = writable<State>({
    checked: new Set(),
    all: new Set(read(spaces).all.map((s) => s.id)),
  })

  function run() {
    const ss = read(spaces).all
    const implications = indexTheorems(read(theorems))

    set({ checked: new Set(), all: new Set(ss.map((s) => s.id)) })

    eachTick(ss, (s: Space, halt: () => void) => {
      update((state) => ({ ...state, checking: s.name }))

      const map = new Map(
        read(traits)
          .forSpace(s)
          .map(([p, t]) => [p.id.toString(), t.value]),
      )
      const prover = new Prover(implications, map)

      const contradiction = prover.run()
      if (contradiction) {
        update((s) => ({ ...s, contradiction }))
        halt()
        return
      }

      const { proofs = [] } = prover.derivations()

      const newTraits: DeducedTrait[] = proofs.map(
        ({ property, value, proof }) => ({
          asserted: false,
          space: s.id,
          property: parseInt(property),
          value,
          proof: {
            properties: proof.properties.map(parseInt),
            theorems: proof.theorems.map(parseInt),
          },
        }),
      )

      addTraits(newTraits)

      update((state) => ({
        ...state,
        checked: new Set([...state.checked, s.id]),
      }))
    })
  }

  theorems.subscribe(run)

  return {
    subscribe,
    run,
    checked(spaceId: number) {
      return subscribeUntil(
        { subscribe },
        (state) => state.checked.has(spaceId) || !!state.contradiction,
      )
    },
  }
}
