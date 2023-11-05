import { describe, expect, it } from 'vitest'
import { atom, property, space, theorem } from '@/__test__'
import { Collection, Theorems } from '@/models'

import { internal } from './internalLinks'

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

  const link = internal(properties, spaces, theorems)

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
})
