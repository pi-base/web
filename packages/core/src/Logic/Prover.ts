import * as F from '../Formula'
import { union } from '../Util'

import ImplicationIndex from './ImplicationIndex'
import Queue from './Queue'
import { Evidence, Formula, Id, Implication, Proof } from './Types'

export default class Prover<T extends Implication> {
  traits: Map<Id, boolean>

  private proofs: Map<Id, Evidence>
  private queue: Queue<T>

  static build(implications: Implication[], traits: [string, boolean][]) {
    return new Prover(
      new ImplicationIndex(implications),
      new Map(traits)
    )
  }

  constructor(implications: ImplicationIndex<T>, traits: Map<Id, boolean> = new Map()) {
    this.traits = traits

    this.proofs = new Map()
    this.queue = new Queue(implications)

    traits.forEach((_: boolean, id: Id) => {
      this.proofs.set(id, 'given')
      this.queue.mark(id)
    })
  }

  apply(implication: Implication): Proof | undefined {
    const a = implication.when
    const c = implication.then
    const av = F.evaluate(a, this.traits)
    const cv = F.evaluate(c, this.traits)

    if (av === true && cv === false) {
      return this.contradiction(implication.uid, union(F.properties(a), F.properties(c)))
    } else if (av === true) {
      return this.force(implication.uid, c, F.properties(a))
    } else if (cv === false) {
      return this.force(implication.uid, F.negate(a), F.properties(c))
    }
  }

  run(): Proof | undefined {
    let theorem
    while (theorem = this.queue.shift()) {
      const contradiction = this.apply(theorem)
      if (contradiction) { return contradiction }
    }
  }

  derivations() {
    const contradiction = this.run()
    if (contradiction) { return { contradiction } }

    const proofs: { property: string, value: boolean, proof: Proof }[] = []
    this.traits.forEach((value: boolean, property: string) => {
      const proof = this.proof(property)
      if (!proof || proof === 'given') { return }

      proofs.push({ property, value, proof })
    })

    return { proofs }
  }

  proof(property: Id) {
    const proof = this.proofs.get(property)
    switch (proof) {
      case 'given': return 'given'
      case undefined: return undefined
      default: return this.expand(proof.theorem, proof.properties)
    }
  }

  private contradiction(theorem: Id, properties: Set<Id>) {
    return this.expand(theorem, Array.from(properties))
  }

  private expand(theorem: Id, properties: Id[]) {
    let theoremByProperty = new Map<Id, Id>()
    let assumptions = new Set<Id>()
    let queue = Array.from(properties)
    let expanded = new Set<Id>()

    let property
    while (property = queue.shift()) {
      if (expanded.has(property)) { continue }

      const proof = this.proofs.get(property)
      if (proof === 'given' || (proof && proof.theorem === 'given')) {
        expanded.add(property)
        assumptions.add(property)
      } else if (proof) {
        theoremByProperty.set(property, proof.theorem)
        expanded.add(property)
        queue = queue.concat(proof.properties)
      }
    }

    return {
      theorems: Array.from(theoremByProperty.values()).concat(theorem),
      properties: Array.from(assumptions)
    }
  }

  force(theorem: Id, formula: Formula, support: Set<Id>): Proof | undefined {
    switch (formula.kind) {
      case 'and':
        return this.forceAnd(theorem, formula, support)
      case 'atom':
        return this.forceAtom(theorem, formula, support)
      case 'or':
        return this.forceOr(theorem, formula, support)
    }
  }

  private forceAtom(theorem: Id, formula: F.Atom<Id>, support: Set<Id>) {
    const property = formula.property

    if (this.traits.has(property)) {
      if (this.traits.get(property) !== formula.value) {
        return this.contradiction(theorem, new Set(property))
      } else {
        return
      }
    }

    this.traits.set(property, formula.value)
    this.proofs.set(property, {
      theorem,
      properties: Array.from(support)
    })
    this.queue.mark(property)
  }

  private forceAnd(theorem: Id, formula: F.And<Id>, support: Set<Id>) {
    for (const sub of formula.subs) {
      const contradiction = this.force(theorem, sub, support)
      if (contradiction) { return contradiction }
    }
  }

  private forceOr(theorem: Id, formula: F.Or<Id>, support: Set<Id>) {
    const result = formula.subs.reduce(
      (
        acc: { falses: Formula[], unknown: Formula | undefined } | undefined,
        sf: Formula
      ) => {
        if (!acc) { return undefined }

        const value = F.evaluate(sf, this.traits)
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
      { falses: Array<Formula>(), unknown: undefined }
    )

    if (!result) return

    const falseProps = union<Id>(...result.falses.map(F.properties))

    if (result.falses.length === formula.subs.length) {
      return this.contradiction(theorem, falseProps)
    } else if (result.unknown) {
      return this.force(theorem, result.unknown, union(support, falseProps))
    }
  }
}

export function disprove<T extends Implication>(implications: ImplicationIndex<T>, formula: Formula): Id[] | 'tautology' | undefined {
  let proof
  const prover = new Prover(implications)

  proof = prover.force('given', formula, new Set())
  if (proof) { return formatProof(proof) }

  proof = prover.run()
  if (proof) { return formatProof(proof) }
}

export function prove(theorems: Implication[], when: Formula, then: Formula): Id[] | 'tautology' | undefined {
  return disprove(
    new ImplicationIndex(theorems),
    F.and(when, F.negate(then))
  )
}

const formatProof = (proof: Proof) => {
  const filtered = proof.theorems.filter(id => id !== 'given')
  return filtered.length > 0 ? filtered : 'tautology'
}