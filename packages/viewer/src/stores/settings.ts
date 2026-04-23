import { writable } from 'svelte/store'
import { defaultStorage } from '@/repositories'

export function persistedBoolean(
  key: string,
  defaultValue: boolean,
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = defaultStorage,
) {
  const store = writable<boolean>(
    storage.getItem(key) !== null ? true : defaultValue,
  )

  store.subscribe(v => {
    if (v) {
      storage.setItem(key, 'show')
    } else {
      storage.removeItem(key)
    }
  })

  return store
}

export const showLeanLinks = persistedBoolean('showLeanLinks', false)
export const showRedundancy = persistedBoolean('showRedundancy', false)
