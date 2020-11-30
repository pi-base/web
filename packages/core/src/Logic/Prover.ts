import {
  And,
  Atom,
  Formula,
  Or,
  evaluate,
  negate,
  properties,
} from '../Formula'
import ImplicationIndex from './ImplicationIndex'
import Queue from './Queue'
import { Id, Implication } from './Types'
import { Derivations, Proof } from './Derivations'

export type { Proof } from './Derivations'

// TODO: is it deduction, or derivation

export type Contradiction<TheoremId = Id, PropertyId = Id> = Proof<
  TheoremId,
  PropertyId
>
export type Result<TheoremId = Id, PropertyId = Id> =
  | {
      kind: 'contradiction'
      contradiction: Contradiction<TheoremId, PropertyId>
    }
  | { kind: 'derivations'; derivations: Derivations<TheoremId, PropertyId> }

export default class Prover<
  TheoremId = Id,
  PropertyId = Id,
  Theorem extends Implication<TheoremId, PropertyId> = Implication<
    TheoremId,
    PropertyId
  >
> {
  private traits: Map<PropertyId, boolean>
  private derivations: Derivations<TheoremId, PropertyId>

  private queue: Queue<TheoremId, PropertyId, Theorem>

  constructor(
    implications: ImplicationIndex<TheoremId, PropertyId, Theorem>,
    traits: Map<PropertyId, boolean> = new Map()
  ) {
    this.traits = traits
    this.derivations = new Derivations([...traits.keys()])
    this.queue = new Queue(implications)

    traits.forEach((_: boolean, id: PropertyId) => {
      this.queue.mark(id)
    })
  }

  run(): Result<TheoremId, PropertyId> {
    let theorem
    while ((theorem = this.queue.shift())) {
      const contradiction = this.apply(theorem)
      if (contradiction) {
        return { kind: 'contradiction', contradiction }
      }
    }

    return { kind: 'derivations', derivations: this.derivations }
  }

  force(
    theorem: TheoremId,
    formula: Formula<PropertyId>,
    support: PropertyId[] = []
  ): Contradiction<TheoremId, PropertyId> | undefined {
    switch (formula.kind) {
      case 'and':
        return this.forceAnd(theorem, formula, support)
      case 'atom':
        return this.forceAtom(theorem, formula, support)
      case 'or':
        return this.forceOr(theorem, formula, support)
    }
  }

  private apply(
    implication: Theorem
  ): Contradiction<TheoremId, PropertyId> | undefined {
    const a = implication.when
    const c = implication.then
    const av = evaluate(a, this.traits)
    const cv = evaluate(c, this.traits)

    if (av === true && cv === false) {
      return this.contradiction(implication.id, [
        ...properties(a),
        ...properties(c),
      ])
    } else if (av === true) {
      return this.force(implication.id, c, [...properties(a)])
    } else if (cv === false) {
      return this.force(implication.id, negate(a), [...properties(c)])
    }
  }

  private contradiction(
    theorem: TheoremId,
    properties: PropertyId[]
  ): Contradiction<TheoremId, PropertyId> {
    return this.derivations.expand([theorem, properties])
  }

  private forceAtom(
    theorem: TheoremId,
    formula: Atom<PropertyId>,
    support: PropertyId[]
  ): Contradiction<TheoremId, PropertyId> | undefined {
    const property = formula.property

    if (this.traits.has(property)) {
      if (this.traits.get(property) !== formula.value) {
        return this.contradiction(theorem, [property])
      } else {
        return
      }
    }

    this.traits.set(property, formula.value)
    this.derivations.addEvidence(property, formula.value, theorem, support)
    this.queue.mark(property)
  }

  private forceAnd(
    theorem: TheoremId,
    formula: And<PropertyId>,
    support: PropertyId[]
  ): Contradiction<TheoremId, PropertyId> | undefined {
    for (const sub of formula.subs) {
      const contradiction = this.force(theorem, sub, support)
      if (contradiction) {
        return contradiction
      }
    }
  }

  private forceOr(
    theorem: TheoremId,
    formula: Or<PropertyId>,
    support: PropertyId[]
  ): Contradiction<TheoremId, PropertyId> | undefined {
    const result = formula.subs.reduce(
      (
        acc:
          | {
              falses: Formula<PropertyId>[]
              unknown: Formula<PropertyId> | undefined
            }
          | undefined,
        sf: Formula<PropertyId>
      ) => {
        if (!acc) {
          return undefined
        }

        const value = evaluate(sf, this.traits)
        if (value === true) {
          return undefined // Can't force anything
        } else if (value === false) {
          acc.falses.push(sf)
        } else if (acc.unknown) {
          return undefined // Can't determine which to force
        } else {
          acc.unknown = sf
        }
        return acc
      },
      { falses: Array<Formula<PropertyId>>(), unknown: undefined }
    )

    if (!result) return

    const falseProps = result.falses.reduce<PropertyId[]>(
      (acc, f) => acc.concat([...properties(f)]),
      []
    )

    if (result.falses.length === formula.subs.length) {
      return this.contradiction(theorem, falseProps)
    } else if (result.unknown) {
      return this.force(theorem, result.unknown, [...support, ...falseProps])
    }
  }
}
