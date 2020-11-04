import { and, atom, property, space, trait } from '@pi-base/core/lib/testUtils'
import { writable } from 'svelte/store'
import { indexByUid } from './collection'
import Traits from '../models/Traits'

import type { Property, Space, Trait } from '../types'
import create, { Search } from './search'

const properties: Record<string, Property> = {}

function p(id: string | number) {
  id = '' + id
  return (properties[id] = properties[id] || property({ uid: `P${id}` }))
}

function setup(data: Record<string, Record<number, boolean>>): Search {
  const spaces = new Set<Space>()
  const properties = new Set<Property>()
  const traits: Trait[] = []

  Object.entries(data).forEach(([name, map], i) => {
    const s = space({ uid: `S${i}`, name })
    spaces.add(s)

    Object.entries(map).forEach(([pid, value]) => {
      const property = p(pid)
      properties.add(property)

      traits.push(trait({ property: property.uid, space: s.uid, value }))
    })
  })

  return create({
    spaces: writable(indexByUid(Array.from(spaces))),
    traits: writable(
      new Traits(traits, Array.from(spaces), Array.from(properties)),
    ),
  })
}

describe('with a store', () => {
  const store = setup({
    foo: {
      1: true,
      2: false,
    },
    bar: {
      1: true,
      2: true,
    },
    baz: {
      1: false,
      2: false,
    },
  })

  it('can search by name', () => {
    expect(store.search({ text: 'ba' }).map((s) => s.name)).toEqual([
      'bar',
      'baz',
    ])
  })

  it('can search by formula', () => {
    const formula = and(atom(p(1)), atom(p(2)))

    expect(store.search({ formula }).map((s) => s.name)).toEqual(['bar'])
  })

  it('can do both', () => {
    expect(
      store
        .search({
          text: 'ba',
          formula: atom(p(1), false),
        })
        .map((s) => s.name),
    ).toEqual(['baz'])
  })
})
