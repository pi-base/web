import { Bundle } from '../Bundle'
import { atom } from '../Formula'
import { Space } from '../Space'
import { Trait } from '../Trait'
import { Implication } from './Types'

import ImplicationIndex from './ImplicationIndex'
import Prover from './Prover'
import { Id, Proof } from './Types'

type TraitId = {
  space: Id
  property: Id
}

export default class Universe {
  private provers: Map<Id, Prover<Implication>>
  private implications: ImplicationIndex<Implication>

  static fromBundle(bundle: Bundle): Universe {
    const u = new Universe(new Map(), new ImplicationIndex(Array.from(bundle.theorems.values())))

    bundle.traits.forEach((value: Trait) => {
      u.prover(value.space).force(
        // FIXME: correctly record support
        'given',
        atom(value.property, value.value),
        new Set([value.property])
      )
    })

    return u
  }

  constructor(provers: Map<Id, Prover<Implication>>, implications: ImplicationIndex<Implication>) {
    this.provers = provers
    this.implications = implications
  }

  trait({ space, property }: TraitId): boolean | undefined {
    return this.prover(space).traits.get(property)
  }

  proof({ space, property }: TraitId): Proof | 'given' | undefined {
    return this.prover(space).proof(property)
  }

  contradiction(space: Space): Proof | undefined {
    return this.prover(space.uid).run()
  }

  protected prover(space: Id): Prover<Implication> {
    if (!this.provers.has(space)) {
      this.provers.set(space, new Prover(this.implications))
    }
    return this.provers.get(space)!
  }
}