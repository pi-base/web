import {
  Store,
  load,
  writeToStorage
} from './Store'

function mockStorage() {
  let storage: any = {}

  return {
    setItem(key: string, value: string) {
      storage[key] = value || ''
    },

    getItem(key: string) {
      return key in storage ? storage[key] : null
    },

    get length() {
      return Object.keys(storage).length
    },

    removeItem(key: string) {
      delete storage[key]
    },

    key(i: number) {
      return Object.keys(storage)[i] || null
    },

    clear() {
      storage = {}
    }
  }
}

describe('Store', () => {
  describe('load', () => {
    let storage: Storage

    beforeEach(() => {
      storage = mockStorage()
    })

    function bundle(branch: string) {
      return {
        branch
      }
    }

    it.todo('fetches from remote if not stored')
    it.todo('loads from storage if stored branch matches')
    it.todo('persists to storage after fetching')
    it.todo('fetches from remote if stored branch does not match')
  })
})
