import { get } from 'svelte/store'
import type { ILocal } from './repositories/local'
import * as debug from './debug'

import { Context, initialize } from './context'
import type * as Sync from './stores/sync'

jest.spyOn(debug, 'trace')

describe('context', () => {
  let local: ILocal
  let context: Context
  let syncs: number

  describe('no-op sync', () => {
    beforeEach(() => {
      local = {
        source: undefined,
        data: undefined,
        synced: undefined,
      }

      syncs = 0

      context = initialize(local, async () => {
        syncs += 1
        return undefined
      })
    })

    test('syncs on boot', () => {
      expect(syncs).toEqual(1)
      expect(local.synced).not.toBeUndefined()
    })

    test('syncs on branch change', () => {
      context.source.checkout('development')
      expect(syncs).toEqual(2)
    })

    test('syncs on host change', () => {
      context.source.setHost('example')
      expect(syncs).toEqual(2)
    })

    test('can manually sync', () => {
      context.sync.sync()
      expect(syncs).toEqual(2)
    })
  })

  describe('with a local cache', () => {
    beforeEach(() => {
      local = {
        source: undefined,
        data: {
          properties: [],
          spaces: [],
          theorems: [],
          traits: [],
          etag: 'etag',
          sha: 'sha',
        },
        synced: new Date(),
      }

      syncs = 0

      context = initialize(local, async () => {
        syncs += 1
        return undefined
      })
    })

    test('does not sync on boot', () => {
      expect(syncs).toEqual(0)
    })

    test('can manually sync', () => {
      context.sync.sync()
      expect(syncs).toEqual(1)
    })
  })

  describe('failing sync', () => {
    beforeEach(() => {
      local = {
        source: undefined,
        data: undefined,
        synced: undefined,
      }

      context = initialize(local, async () => {
        throw new Error('Failed to sync')
      })
    })

    it('notes the failure', () => {
      const sync = get<Sync.State, Sync.Store>(context.sync)

      expect(sync.kind).toEqual('error')
      expect((sync as { error: { message: string } }).error.message).toContain(
        'Failed to sync',
      )
    })
  })
})
