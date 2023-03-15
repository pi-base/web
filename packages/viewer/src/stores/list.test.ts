import { beforeEach, expect, it } from 'vitest'
import { get, readable } from 'svelte/store'

import list, { type Store } from './list'

type Item = { name: string; value: number }
const items: Item[] = [
  { name: 'Two', value: 2 },
  { name: 'Twelve', value: 12 },
  { name: 'One', value: 1 },
  { name: 'Three', value: 3 },
  { name: 'Eight', value: 8 },
]

let store: Store<{ name: string; value: number }>

beforeEach(() => {
  store = list(
    readable(items, () => { }),
    {
      weights: {
        name: 1,
      },
    },
  )
})

function values() {
  return get<Item[]>(store).map(i => i.value)
}

it('has the expected values', () => {
  expect(get(store)).toEqual(items)
})

it('can sort', () => {
  store.sort('name')()
  expect(values()).toEqual([8, 1, 3, 12, 2])

  store.sort('value')()
  expect(values()).toEqual([1, 2, 3, 8, 12])
})

it('can filter', () => {
  store.filter.set('twe')

  expect(values()).toEqual([12, 2])
})
