import { atom, or } from '../Formula'

import ImplicationIndex from './ImplicationIndex'

describe('ImplicationIndex', () => {
  const implications = [
    { uid: '1', when: atom('A'), then: atom('B') },
    { uid: '2', when: atom('B'), then: or(atom('C'), atom('D')) }
  ]

  const index = new ImplicationIndex(implications)

  it('can return all items', () => {
    expect(index.all).toEqual(implications)
  })

  it('finds by property name', () => {
    expect(index.withProperty('D')).toEqual(new Set([implications[1]]))
  })

  it('can match multiple implications', () => {
    expect(index.withProperty('B')).toEqual(new Set(implications))
  })

  it('can fail to find', () => {
    expect(index.withProperty('Z')).toEqual(new Set())
  })
})
