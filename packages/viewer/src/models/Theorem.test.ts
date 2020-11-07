import { and, atom, property, theorem } from '@pi-base/core/lib/testUtils'
import type { Property } from '../models'

import Theorem from './Theorem'

const p1 = property({ uid: 'P000001' })
const p2 = property({ uid: 'P000002' })
const p3 = property({ uid: 'P000003' })

describe('hydrate', () => {
  const raw = theorem({
    uid: 'T000001',
    when: and(atom('P000001'), atom('P000002')),
    then: atom('P000003'),
  })

  function index(properties: Property[]) {
    const ix = new Map(properties.map((p) => [p.uid, p]))
    return (uid: string) => ix.get(uid)
  }

  it('creates formulae with full properties', () => {
    const find = index([p1, p2, p3])

    const hydrated = Theorem.hydrate(raw, find)!

    expect(hydrated.when).toEqual(and(atom(p1), atom(p2)))
    expect(hydrated.then).toEqual(atom(p3))
    expect(hydrated.name).toEqual('(P000001 ∧ P000002) ⇒ P000003')
  })

  it('returns undefined if references are not present', () => {
    const find = index([p1, p3])

    expect(Theorem.hydrate(raw, find)).toBeUndefined()
  })
})

describe('properties', () => {
  it('lists the referenced theorems', () => {
    const theorem = new Theorem({
      uid: 'T1',
      when: and(atom(p1), atom(p2)),
      then: atom(p3),
    })

    expect(theorem.properties).toEqual([p1, p2, p3])
  })
})

describe('converse', () => {
  it('reverses the implication', () => {
    const theorem = new Theorem({
      uid: 'T1',
      when: atom(p1),
      then: atom(p3),
    })

    expect(theorem.converse.when).toEqual(atom(p3))
    expect(theorem.converse.then).toEqual(atom(p1))
  })
})
