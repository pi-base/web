import { atom, property, space, theorem } from '@pi-base/core/lib/testUtils'
import type { Data, Source } from '../types'
import { Local } from './local'

let storage: Storage
let local: Local

beforeEach(() => {
  let db: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any

  storage = {
    clear() {
      db = {}
    },
    get length() {
      return Object.keys(db).length
    },
    getItem(key: string) {
      return db[key]
    },
    removeItem(key: string) {
      delete db[key]
    },
    setItem(key: string, value: string) {
      db[key] = value
    },
    key(index: number) {
      return Object.keys(db)[index]
    },
  }

  local = new Local(storage)
})

it('round-trips dates', () => {
  const now = new Date()
  local.synced = now

  expect(local.synced).toEqual(now)
})

it('round-trips sources', () => {
  const source: Source = { host: 'example', branch: 'main' }
  local.source = source

  expect(local.source).toEqual(source)
})

it('round-trips data', () => {
  const data: Data = {
    spaces: [space({ uid: 'S1' })],
    properties: [property({ uid: 'P1' }), property({ uid: 'P2' })],
    theorems: [
      theorem({
        uid: 'T1',
        when: atom('P1'),
        then: atom('P2'),
      }),
    ],
    traits: [],
    etag: 'etag',
    sha: 'sha',
  }

  local.data = data

  expect(local.data).toEqual(data)
})
