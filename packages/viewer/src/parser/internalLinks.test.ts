import type { Property, Space, Theorem } from '@pi-base/core'
import { atom, property, space, theorem } from '@pi-base/core/lib/testUtils'
import { Collection, index } from '../stores/collection'

import internalLinks from './internalLinks'

describe('with ambient data', () => {
  function ix<T extends { uid: string }>(...items: T[]): Collection<T> {
    return index(items, (i) => parseInt(i.uid.slice(1)))
  }

  const properties: Collection<Property> = ix(
    property({ uid: 'P000001', name: 'One' }),
    property({ uid: 'P000002', name: 'Two' }),
  )
  const spaces: Collection<Space> = ix(space({ uid: 'S000002', name: 'Two' }))
  const theorems: Collection<Theorem> = ix(
    theorem({
      uid: 'T000003',
      when: atom('P000001'),
      then: atom('P000002'),
    }),
  )

  const link = internalLinks(properties, spaces, theorems)

  describe('properties', () => {
    it('can link to properties', () => {
      expect(link({ to: 'P000001' })).toEqual({
        href: '/properties/P000001',
        label: 'One',
      })
    })

    it('renders not found errors', () => {
      expect(link({ to: 'P000003' })).toEqual('Could not find Property P000003')
    })

    it('expands padding if needed', () => {
      expect(link({ to: 'P1' })).toEqual({
        href: '/properties/P000001',
        label: 'One',
      })
    })
  })

  describe('spaces', () => {
    it('can link to spaces', () => {
      expect(link({ to: 'S000002' })).toEqual({
        href: '/spaces/S000002',
        label: 'Two',
      })
    })

    it('renders not found errors', () => {
      expect(link({ to: 'S000003' })).toEqual('Could not find Space S000003')
    })
  })

  it('handles empty links', () => {
    expect(link({ to: '' })).toBeUndefined()
    expect(link({})).toBeUndefined()
  })
})
