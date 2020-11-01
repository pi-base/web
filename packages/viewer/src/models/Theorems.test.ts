import {
  and,
  atom,
  property,
  space,
  trait,
  theorem,
} from '@pi-base/core/lib/testUtils'
import type { Property, Space } from '../types'

import Theorems from './Theorems'

const p1 = property({ uid: 'P1' })
const p2 = property({ uid: 'P2' })
const p3 = property({ uid: 'P3' })

const t1 = theorem({
  uid: 'T1',
  when: atom('P1'),
  then: atom('P2'),
})

const t2 = theorem({
  uid: 'T2',
  when: atom('P2'),
  then: atom('P3'),
})

const theorems = Theorems.fromData({
  properties: [p1, p2, p3],
  theorems: [t1, t2],
})

test('all', () => {
  expect(theorems.all.length).toEqual(2)
})

test('find by number', () => {
  expect(theorems.find(1)!.uid).toEqual('T1')
})

test('find by id', () => {
  expect(theorems.find('T002')!.uid).toEqual('T2')
})

describe('forProperty', () => {
  test('P1', () => {
    expect(theorems.forProperty(p1).map((t) => t.uid)).toEqual(['T1'])
  })

  test('P2', () => {
    expect(theorems.forProperty(p2).map((t) => t.uid)).toEqual(['T1', 'T2'])
  })
})
