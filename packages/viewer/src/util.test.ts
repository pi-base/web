import { describe, expect, it } from 'vitest'
import { writable } from 'svelte/store'

import {
  capitalize,
  eachTick,
  normalizeIdRedirect,
  normalizeIds,
  read,
  subscribeUntil,
} from './util'

describe('eachTick', () => {
  it('iterates through a list', async () => {
    const result: number[] = []

    await eachTick([1, 2, 3], n => result.push(2 * n))

    expect(result).toEqual([2, 4, 6])
  })

  it('can abort early', async () => {
    const result: number[] = []

    await eachTick([1, 2, 3, 4, 5], (n, halt) => {
      if (n > 3) {
        halt()
      } else {
        result.push(2 * n)
      }
    })

    expect(result).toEqual([2, 4, 6])
  })
})

describe('read', () => {
  it('reads the store state', () => {
    expect(read(writable(5))).toEqual(5)
  })
})

describe('subscribeUntil', () => {
  it('resolves when the condition is met', async () => {
    const store = writable(0)

    let done = false
    const wait = subscribeUntil(store, n => n > 5).then(() => (done = true))

    store.set(1)
    expect(done).toEqual(false)

    store.set(10)
    await wait
    expect(done).toEqual(true)
  })
})

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello')).toEqual('Hello')
  })
})

describe('normalizeIds', () => {
  it('processes single ids', () => {
    expect(
      normalizeIds(new URL('http://example.com/spaces/S1.md'), 'S1.md').href,
    ).toEqual('http://example.com/spaces/S000001')
  })

  it('processes nested ids', () => {
    expect(
      normalizeIds(
        new URL('http://example.com/spaces/s02.md/properties/P003.md'),
        's02.md',
        'P003.md',
      ).href,
    ).toEqual('http://example.com/spaces/S000002/properties/P000003')
  })
})

describe('normalizeIdRedirect', () => {
  it('redirects if needed', () => {
    expect(() =>
      normalizeIdRedirect(
        new URL('http://example.com/theorems/T5.md'),
        'T5.md',
      ),
    ).toThrow()
  })

  it('no-ops if valid', () => {
    expect(() =>
      normalizeIdRedirect(
        new URL('http://example.com/theorems/T000005'),
        'T000005',
      ),
    ).not.toThrow()
  })
})
