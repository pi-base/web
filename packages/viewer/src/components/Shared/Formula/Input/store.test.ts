import { Writable, get, writable } from 'svelte/store'
import { Collection, Formula, Property } from '../../../../models'

import { Store, State, create } from './store'
import { atom, property } from '../../../../__test__'

describe('create', () => {
  let raw: Writable<string>
  let formula: Writable<Formula<Property> | undefined>
  let properties: Writable<Collection<Property>>

  let store: Store
  let state: State

  beforeEach(() => {
    raw = writable('')
    formula = writable<Formula<Property> | undefined>(undefined)
    properties = writable(
      Collection.byId([
        property({ id: 1, name: 'Foo' }),
        property({ id: 2, name: 'Bar' }),
        property({ id: 3, name: 'Baz' }),
        property({ id: 4, name: 'Quux', aliases: ['Fez'] }),
      ]),
    )

    store = create({ raw, formula, properties })
    store.subscribe((s) => (state = s))
  })

  it('updates the suggestions on text change', () => {
    raw.set('Ba')

    expect(state.suggestions.map((p) => p.name)).toEqual(['Bar', 'Baz'])
    expect(get(formula)).toEqual(atom(property({ id: 2, name: 'Bar' })))
  })

  it('updates the formula on text change', () => {
    raw.set('Ba')

    expect(get(formula)).toEqual(atom(property({ id: 2, name: 'Bar' })))
  })

  it('can select from suggestions', () => {
    raw.set('Ba')

    store.changeSelected(1)
    store.expand()

    expect(get(raw)).toEqual('Bar')
  })

  it('wraps backwards when decrementing', () => {
    raw.set('Ba')

    store.changeSelected(-1)
    store.expand()

    expect(get(raw)).toEqual('Baz')
  })
})
