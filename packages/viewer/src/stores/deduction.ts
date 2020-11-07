import { Readable, get, writable } from 'svelte/store'
import { ImplicationIndex, Prover } from '@pi-base/core'
import type { Proof } from '@pi-base/core/lib/Logic/Types'
import * as F from '@pi-base/core/lib/Formula'
import type { Collection, Space, Theorems, Traits } from '../models'
import type { Store as TraitsStore } from './traits'
import { eachTick, read } from '../util'

export type State =
  | {
      kind: 'checking'
      checked: number
      total: number
    }
  | {
      kind: 'contradiction'
      proof: Proof
    }

export type Store = Readable<State> & {
  run(): void
}

export function create(
  spaces: Readable<Collection<Space>>,
  traits: TraitsStore,
  theorems: Readable<Theorems>,
): Store {
  const { set, subscribe, update } = writable<State>({
    kind: 'checking',
    checked: 0,
    total: read(spaces).all.length,
  })

  function run() {
    const ss = read(spaces).all
    const ths = read(theorems)
    const trs = read(traits)

    const implications = new ImplicationIndex(
      ths.all.map(({ uid, when, then }) => ({
        uid,
        when: F.mapProperty((p) => p.uid, when),
        then: F.mapProperty((p) => p.uid, then),
      })),
    )

    set({ kind: 'checking', checked: 0, total: ss.length })

    eachTick(ss, (s: Space, si: number, halt: () => void) => {
      update((state) => ({ ...state, checking: s.name }))

      const map = new Map(trs.forSpace(s).map(([p, t]) => [p.uid, t.value]))
      const prover = new Prover(implications, map)

      const contradiction = prover.run()
      if (contradiction) {
        set({ kind: 'contradiction', proof: contradiction })
        halt()
        return
      }

      const { proofs = [] } = prover.derivations()

      const newTraits = proofs.map(({ property, value, proof }) => ({
        uid: '', // FIXME
        counterexamples_id: undefined,
        space: s.uid,
        property,
        value,
        proof,
        description: '',
        refs: [],
      }))

      traits.add(newTraits)

      update((state) => ({ ...state, checked: si }))
    })
  }

  theorems.subscribe(run)

  return {
    subscribe,
    run,
  }
}
