import { beforeEach, describe, expect, it } from 'vitest'
import { get } from 'svelte/store'
import { persistedBoolean, showLeanLinks, showRedundancy } from './settings'

function mockStorage() {
  const data: Record<string, string> = {}
  return {
    data,
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => {
      data[key] = value
    },
    removeItem: (key: string) => {
      delete data[key]
    },
  }
}

describe('persistedBoolean', () => {
  it('defaults to the given default value when storage is empty', () => {
    const storage = mockStorage()
    const store = persistedBoolean('flag', false, storage)
    expect(get(store)).toBe(false)
  })

  it('initializes to true when the key already exists in storage', () => {
    const storage = mockStorage()
    storage.data['flag'] = 'show'
    const store = persistedBoolean('flag', false, storage)
    expect(get(store)).toBe(true)
  })

  it('writes to storage when set to true', () => {
    const storage = mockStorage()
    const store = persistedBoolean('flag', false, storage)
    store.set(true)
    expect(storage.data['flag']).toBe('show')
  })

  it('removes from storage when set to false', () => {
    const storage = mockStorage()
    storage.data['flag'] = 'show'
    const store = persistedBoolean('flag', true, storage)
    store.set(false)
    expect(storage.data['flag']).toBeUndefined()
  })

  it('reflects updates via subscribe', () => {
    const storage = mockStorage()
    const store = persistedBoolean('flag', false, storage)
    const values: boolean[] = []
    store.subscribe(v => values.push(v))

    store.set(true)
    store.set(false)

    expect(values).toEqual([false, true, false])
  })
})

describe('showLeanLinks', () => {
  it('defaults to false', () => {
    expect(get(showLeanLinks)).toBe(false)
  })

  it('can be toggled', () => {
    showLeanLinks.set(true)
    expect(get(showLeanLinks)).toBe(true)
    showLeanLinks.set(false)
    expect(get(showLeanLinks)).toBe(false)
  })
})

describe('showRedundancy', () => {
  it('defaults to false', () => {
    expect(get(showRedundancy)).toBe(false)
  })

  it('can be toggled', () => {
    showRedundancy.set(true)
    expect(get(showRedundancy)).toBe(true)
    showRedundancy.set(false)
    expect(get(showRedundancy)).toBe(false)
  })
})
