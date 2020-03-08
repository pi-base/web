import * as F from './Formula'
import { union } from './Util'

type Id = string

type Evidence = {
  theorem: Id,
  properties: Id[]
} | 'given'

type Formula = F.Formula<Id>

interface Implication {
  uid: string
  when: Formula
  then: Formula
}

interface Proof {
  theorems: Id[]
  properties: Id[]
}

class Queue {
  private index: Map<Id, Set<Implication>>
  private queue: Set<Implication>

  constructor(implications: Implication[]) {
    this.index = new Map()
    this.queue = new Set(implications)

    implications.forEach((i: Implication) => {
      union(
        F.properties(i.when),
        F.properties(i.then)
      ).forEach((id: Id) => {
        if (!this.index.has(id)) { this.index.set(id, new Set()) }
        this.index.get(id)!.add(i)
      })
    })
  }

  mark(property: Id) {
    const implications = this.index.get(property) || []
    implications.forEach((i: Implication) => this.queue.add(i))
  }

  shift(): Implication | undefined {
    // TODO: this.queue.values().next().value ?
    const item = Array.from(this.queue)[0]
    if (item) { this.queue.delete(item) }
    return item
  }
}

export class Prover {
  traits: Map<Id, boolean>

  private proofs: Map<Id, Evidence>
  private queue: Queue

  constructor(implications: Implication[], traits: Map<Id, boolean>) {
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

    let property
    while (property = queue.shift()) {
      const proof = this.proofs.get(property)
      if (proof === 'given') {
        assumptions.add(property)
      } else if (proof) {
        theoremByProperty.set(property, proof.theorem)
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
      { falses: [], unknown: undefined }
    )

    if (!result) return

    const falseProps = union(...result.falses.map(F.properties))

    if (result.falses.length === formula.subs.length) {
      return this.contradiction(theorem, falseProps)
    } else if (result.unknown) {
      return this.force(theorem, result.unknown, union(support, falseProps))
    }
  }
}

export function prove(theorems: Implication[], when: Formula, then: Formula): Id[] | 'tautology' | undefined {
  let proof
  const prover = new Prover(theorems, new Map())

  proof = prover.force(
    'given',
    F.and(
      when,
      F.negate(then)
    ),
    new Set()
  )
  if (proof) { return formatProof(proof) }

  proof = prover.run()
  if (proof) { return formatProof(proof) }
}

const formatProof = (proof: Proof) => {
  const filtered = proof.theorems.filter(id => id !== 'given')
  return filtered.length > 0 ? filtered : 'tautology'
}