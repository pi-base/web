import { Readable, get, writable } from 'svelte/store'
import { ImplicationIndex, Prover } from '@pi-base/core'
import * as F from '@pi-base/core/lib/Formula'
import type { Collection, Space, Theorems, Traits } from '../models'
import type { Store as TraitsStore } from './traits'

export type State = {
  checking: string | undefined
  checked: number
  total: number
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
    checked: 0,
    checking: undefined,
    total: get<Collection<Space>, Readable<Collection<Space>>>(spaces).all
      .length,
  })

  function run() {
    const ss = get<Collection<Space>, Readable<Collection<Space>>>(spaces).all
    const ths = get<Theorems, Readable<Theorems>>(theorems)
    const trs = get<Traits, TraitsStore>(traits)

    const implications = new ImplicationIndex(
      ths.all.map(({ uid, when, then }) => ({
        uid,
        when: F.mapProperty((p) => p.uid, when),
        then: F.mapProperty((p) => p.uid, then),
      })),
    )

    set({ checked: 0, checking: undefined, total: ss.length })

    eachTick(ss, (s: Space, si: number) => {
      update((state) => ({ ...state, checking: s.name }))

      const map = new Map(trs.forSpace(s).map(([p, t]) => [p.uid, t.value]))
      const prover = new Prover(implications, map)

      const contradiction = prover.run()
      if (contradiction) {
        // TODO
        console.log({ contradiction })
      } else {
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
      }

      update((state) => ({ ...state, checked: si }))
    })
  }

  theorems.subscribe(run)

  return {
    subscribe,
    run,
  }
}

function eachTick<T>(items: T[], f: (item: T, index: number) => void, i = 0) {
  const item = items[i]
  if (!item) {
    return
  }

  f(item, i)
  setTimeout(() => eachTick(items, f, i + 1), 0)
}
