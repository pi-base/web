import { describe, expect, it } from 'vitest'
import { atom, property, space, theorem, trait } from '@/__test__'
import { Collection, Theorems, Traits } from '@/models'

import { internal } from './internalLinks'

describe('with ambient data', () => {
  const properties = Collection.byId([
    property({ id: 1, name: 'One' }),
    property({ id: 2, name: 'Two' }),
  ])
  const spaces = Collection.byId([
    space({ id: 1, name: 'One' }),
    space({ id: 2, name: 'Two' }),
  ])
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
  const traits = Traits.build(
    [
      trait({ space: 1, property: 1, value: true }),
      trait({ space: 1, property: 2, value: false }),
    ],
    spaces,
    properties,
  )

  const link = internal(properties, spaces, theorems, traits)

  describe('properties', () => {
    it('can link to properties', () => {
      expect(link(['P', '000001'])).toEqual({
        href: '/properties/P000001',
        title: 'One',
      })
    })

    it.todo('renders not found errors', () => {
      expect(link(['P', '000003'])).toEqual('Could not find Property P000003')
    })

    it.todo('expands padding if needed', () => {
      expect(link(['P', '1'])).toEqual({
        href: '/properties/P000001',
        title: 'One',
      })
    })
  })

  describe('spaces', () => {
    it('can link to spaces', () => {
      expect(link(['S', '000002'])).toEqual({
        href: '/spaces/S000002',
        title: 'Two',
      })
    })

    it.todo('renders not found errors', () => {
      expect(link(['S', '000003'])).toEqual('Could not find Space S000003')
    })
  })

  describe('traits', () => {
    it('can link to traits', () => {
      expect(link(['S', '000001|P000001'])).toEqual({
        href: '/spaces/S000001/properties/P000001',
        title: 'One is One',
      })
    })

    it('negates the display', () => {
      expect(link(['S', '000001|P000002'])).toEqual({
        href: '/spaces/S000001/properties/P000002',
        title: 'One is not Two',
      })
    })
  })
})
