import { atom, property, theorem } from '../__test__'

import Collection from './Collection'
import Theorems from './Theorems'

const p1 = property({ id: 1 })
const p2 = property({ id: 2 })
const p3 = property({ id: 3 })

const t1 = theorem({
  id: 1,
  when: atom(1),
  then: atom(2),
})

const t2 = theorem({
  id: 2,
  when: atom(2),
  then: atom(3),
})

const theorems = Theorems.build([t1, t2], Collection.byId([p1, p2, p3]))

test('all', () => {
  expect(theorems.all).toHaveLength(2)
})

describe('find', () => {
  test('find by number', () => {
    expect(theorems.find(1)!.id).toEqual(1)
  })

  test('find by id', () => {
    expect(theorems.find('T002')!.id).toEqual(2)
  })

  test('not found', () => {
    expect(theorems.find(13)).toBeNull()
  })
})

describe('forProperty', () => {
  test('P1', () => {
    expect(theorems.forProperty(p1).map((t) => t.id)).toEqual([1])
  })

  test('P2', () => {
    expect(theorems.forProperty(p2).map((t) => t.id)).toEqual([1, 2])
  })
})
