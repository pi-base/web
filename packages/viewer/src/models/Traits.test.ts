import { and, atom, property, space, trait } from '@pi-base/core/lib/testUtils'
import type { Property, Space } from '../types'

import Traits from './Traits'

const s1 = space({ uid: 'S1' })
const s2 = space({ uid: 'S2' })

const p1 = property({ uid: 'P1' })
const p2 = property({ uid: 'P2' })

const traits = Traits.fromData({
  spaces: [s1, s2],
  properties: [p1, p2],
  traits: [
    trait({ space: 'S1', property: 'P1' }),
    trait({ space: 'S2', property: 'P1' }),
    trait({ space: 'S2', property: 'P2' }),
  ],
})

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
