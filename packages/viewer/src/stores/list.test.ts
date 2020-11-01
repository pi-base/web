import { Readable, get, readable } from 'svelte/store'

import list, { Store } from './list'

type Item = { name: string; value: number }
const items: Item[] = [
  { name: 'Two', value: 2 },
  { name: 'Twelve', value: 12 },
  { name: 'One', value: 1 },
  { name: 'Three', value: 3 },
]

let store: Store<{ name: string; value: number }>

beforeEach(() => {
  store = list(
    readable(items, () => {}),
    {
      weights: {
        name: 1,
      },
    },
  )
})

function values() {
  return get<Item[], Readable<Item[]>>(store).map((i) => i.value)
}

it('has the expected values', () => {
  expect(get(store)).toEqual(items)
})

it('can sort', () => {
  store.sort('name')()
  expect(values()).toEqual([1, 3, 12, 2])

  store.sort('value')()
  expect(values()).toEqual([1, 2, 3, 12])
})

it('can filter', () => {
  store.filter.set('twe')

  expect(values()).toEqual([12, 2])
})
