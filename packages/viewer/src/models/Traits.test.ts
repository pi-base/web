import { describe, expect, test } from 'vitest'
import { atom, property, space, trait } from '@/__test__'

import Collection from './Collection'
import Traits from './Traits'

const s1 = space({ id: 1 })
const s2 = space({ id: 2 })

const p1 = property({ id: 1 })
const p2 = property({ id: 2 })

const traits = Traits.build(
  [
    trait({ space: 1, property: 1 }),
    trait({ space: 2, property: 1 }),
    trait({ space: 2, property: 2 }),
  ],
  Collection.byId([s1, s2]),
  Collection.byId([p1, p2]),
)

test('find', () => {
  expect(traits.find(s1, p1)).not.toBeUndefined()
  expect(traits.find(s1, p2)).toBeUndefined()
})

test('forProperty', () => {
  expect(traits.forProperty(p2)).toEqual([[s2, traits.find(s2, p2)]])
})

test('forSpace', () => {
  expect(traits.forSpace(s1)).toEqual([[p1, traits.find(s1, p1)]])
})

test('size', () => {
  expect(traits.size).toEqual(3)
})

describe('isCounterexample', () => {
  test('disprovable', () => {
    expect(
      traits.isCounterexample(
        {
          when: atom(p1),
          then: atom(p2, false),
        },
        s2,
      ),
    ).toEqual(true)
  })

  test('unknown', () => {
    expect(
      traits.isCounterexample(
        {
          when: atom(p1),
          then: atom(p2, false),
        },
        s1,
      ),
    ).toEqual(false)
  })
})
