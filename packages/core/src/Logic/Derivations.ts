import { Id } from './Types'

type Evidence<TheoremId = Id, PropertyId = Id> = [TheoremId, PropertyId[]]

export type Derivation<TheoremId = Id, PropertyId = Id> = {
  property: PropertyId
  value: boolean
  proof: Proof<TheoremId, PropertyId>
}

export type Proof<TheoremId = Id, PropertyId = Id> = {
  theorems: TheoremId[]
  properties: PropertyId[]
}

export class Derivations<TheoremId = Id, PropertyId = Id> {
  private evidence: Map<PropertyId, Evidence<TheoremId, PropertyId>>
  private given: Set<PropertyId>
  private traits: Map<PropertyId, boolean>

  constructor(assumptions: PropertyId[] = []) {
    this.evidence = new Map()
    this.given = new Set(assumptions)
    this.traits = new Map()
  }

  addEvidence(
    property: PropertyId,
    value: boolean,
    theorem: TheoremId,
    support: PropertyId[],
  ): void {
    this.evidence.set(property, [theorem, support])
    this.traits.set(property, value)
  }

  all(): Derivation<TheoremId, PropertyId>[] {
    const result: Derivation<TheoremId, PropertyId>[] = []

    this.traits.forEach((value: boolean, property: PropertyId) => {
      const proof = this.proof(property)
      if (!proof || proof === 'given') {
        return
      }

      result.push({ property, value, proof })
    })

    return result
  }

  expand([theorem, properties]: Evidence<TheoremId, PropertyId>): Proof<
    TheoremId,
    PropertyId
  > {
    const theoremByProperty = new Map<PropertyId, TheoremId>()
    const assumptions = new Set<PropertyId>()
    const expanded = new Set<PropertyId>()

    let queue = [...properties]
    let property
    while ((property = queue.shift())) {
      if (expanded.has(property)) {
        continue
      }

      if (this.given.has(property)) {
        assumptions.add(property)
        expanded.add(property)
      } else {
        const evidence = this.evidence.get(property)
        if (evidence) {
          theoremByProperty.set(property, evidence[0])
          queue = queue.concat(evidence[1])
          expanded.add(property)
        }
      }
    }

    return {
      theorems: [theorem, ...theoremByProperty.values()].reverse(),
      properties: [...assumptions],
    }
  }

  proof(
    property: PropertyId,
  ): Proof<TheoremId, PropertyId> | 'given' | undefined {
    if (this.given.has(property)) {
      return 'given'
    }

    const evidence = this.evidence.get(property)
    return evidence ? this.expand(evidence) : undefined
  }
}
