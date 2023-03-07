import { describe, expect, it } from 'vitest'
import { and, atom, property, theorem } from '../__test__'
import { Collection, type Property } from '../models'

import Theorem from './Theorem'

const p1 = property({ id: 1 })
const p2 = property({ id: 2 })
const p3 = property({ id: 3 })

describe('hydrate', () => {
  const raw = theorem({
    id: 1,
    when: and(atom(1), atom(2)),
    then: atom(3),
  })

  function index(properties: Property[]) {
    const ix = Collection.byId(properties)
    return (id: number) => ix.find(id) || undefined
  }

  it('creates formulae with full properties', () => {
    const find = index([p1, p2, p3])

    const hydrated = Theorem.hydrate(raw, find)!

    expect(hydrated.when).toEqual(and(atom(p1), atom(p2)))
    expect(hydrated.then).toEqual(atom(p3))
    expect(hydrated.name).toEqual('(Property 1 ∧ Property 2) ⇒ Property 3')
  })

  it('returns undefined if references are not present', () => {
    const find = index([p1, p3])

    expect(Theorem.hydrate(raw, find)).toBeUndefined()
  })
})

describe('properties', () => {
  it('lists the referenced theorems', () => {
    const theorem = new Theorem({
      id: 1,
      when: and(atom(p1), atom(p2)),
      then: atom(p3),
    })

    expect(theorem.properties).toEqual([p1, p2, p3])
  })
})

describe('converse', () => {
  it('reverses the implication', () => {
    const theorem = new Theorem({
      id: 1,
      when: atom(p1),
      then: atom(p3),
    })

    expect(theorem.converse.when).toEqual(atom(p3))
    expect(theorem.converse.then).toEqual(atom(p1))
  })
})
