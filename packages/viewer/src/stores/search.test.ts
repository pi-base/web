import { TraitsArgs, and, atom, traits } from '../__test__'
import { writable } from 'svelte/store'

import type { Collection, Property } from '../models'
import create, { Search } from './search'

let properties: Collection<Property>

function setup(spec: TraitsArgs): Search {
  const state = traits(spec)
  properties = state.properties

  return create({
    spaces: writable(state.spaces),
    traits: writable(state.traits),
  })
}

function p(id: number) {
  return properties.find(id)!
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
