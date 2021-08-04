import { atom, property, space, theorem } from '../__test__'
import { Collection, Theorems } from '../models'

import internalLinks from './internalLinks'

describe('with ambient data', () => {
  const properties = Collection.byId([
    property({ id: 1, name: 'One' }),
    property({ id: 2, name: 'Two' }),
  ])
  const spaces = Collection.byId([space({ id: 2, name: 'Two' })])
  const theorems: Theorems = Theorems.build(
    [
      theorem({
        id: 3,
        when: atom(1),
        then: atom(2),
      }),
    ],
    properties,
  )

  const link = internalLinks(properties, spaces, theorems)

  describe('properties', () => {
    it('can link to properties', () => {
      expect(link('P000001')).toEqual({
        href: '/properties/P000001',
        label: 'One',
      })
    })

    it('renders not found errors', () => {
      expect(link('P000003')).toEqual('Could not find Property P000003')
    })

    it('expands padding if needed', () => {
      expect(link('P1')).toEqual({
        href: '/properties/P000001',
        label: 'One',
      })
    })
  })

  describe('spaces', () => {
    it('can link to spaces', () => {
      expect(link('S000002')).toEqual({
        href: '/spaces/S000002',
        label: 'Two',
      })
    })

    it('renders not found errors', () => {
      expect(link('S000003')).toEqual('Could not find Space S000003')
    })
  })

  it('handles empty links', () => {
    expect(link('')).toBeUndefined()
  })
})
