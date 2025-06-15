import { describe, expect, it, vi, type MockedFunction } from 'vitest'
import { initialize } from './context'
import { writable, type Writable } from 'svelte/store'
import * as Errors from './errors'
import type * as Gateway from './gateway'
import type { Local } from './repositories'
import { renderer } from './parser'
import { type Prestore } from './stores'
import { property, space } from './__test__/factories'
import { get } from 'svelte/store'
import type { Result } from './gateway'

type InitializeParams = Parameters<typeof initialize>[0]

type SetupParams = {
  local: Partial<Prestore>
  remote: Result
} & Pick<InitializeParams, 'showDev' | 'source'>

describe(initialize, () => {
  let db: Local<Prestore> & {
    subscribe: MockedFunction<Local<Prestore>['subscribe']>
  }
  let errorHandler: MockedFunction<Errors.Handler>
  let gateway: MockedFunction<Gateway.Sync>
  let mockRenderer: typeof renderer

  function setup(args: Partial<SetupParams> = {}) {
    vi.clearAllMocks()

    errorHandler = vi.fn()
    mockRenderer = vi.fn()

    const prestore: Prestore = {
      spaces: [],
      properties: [],
      theorems: [],
      traits: [],
      deduction: { checked: new Set(), all: new Set() },
      source: { host: 'example.com', branch: 'main' },
      sync: undefined,
      ...args.local,
    }

    db = {
      load: () => prestore,
      subscribe: vi.fn(),
    }

    gateway = vi.fn(async (_host: string, _branch: string) => args.remote)

    return initialize({
      db,
      errorHandler,
      gateway,
      typesetter: mockRenderer,
      showDev: args.showDev || false,
      source: args.source || {},
    })
  }

  it('should create a context with default dependencies', () => {
    const { showDev, errorHandler } = setup()

    expect(showDev).toBe(false)
    expect(errorHandler).toEqual(errorHandler)
  })

  it('use the provided source', () => {
    const { source } = setup({
      source: { host: 'default.com', branch: 'master' },
    })

    expect(get(source)).toEqual({ host: 'default.com', branch: 'master' })
  })

  it('should trigger sync when local sync state is undefined', () => {
    setup({
      local: {
        source: { host: 'example.com', branch: 'main' },
        sync: undefined,
      },
    })

    expect(gateway).toHaveBeenCalledWith('example.com', 'main', undefined)
  })

  it('persists remote sync state to the local db', async () => {
    const context = setup({
      local: {
        source: { host: 'example.com', branch: 'main' },
        sync: undefined,
      },
      remote: {
        spaces: [space({ id: 123 })],
        properties: [property({ id: 456 })],
        theorems: [],
        traits: [],
        etag: 'etag',
        sha: 'sha',
      },
    })

    await context.loaded()

    const { spaces, properties, sync } = db.subscribe.mock.calls[0][0]

    expect(get(spaces).map(s => s.id)).toEqual([123])
    expect(get(properties).map(p => p.id)).toEqual([456])
    expect(get(sync)).toEqual(
      expect.objectContaining({
        kind: 'fetched',
        value: { etag: 'etag', sha: 'sha' },
      }),
    )
  })

  it('runs deductions', async () => {
    const context = setup({
      local: {
        spaces: [space({ id: 1 })],
        properties: [property({ id: 1 }), property({ id: 2 })],
        traits: [
          {
            asserted: true,
            space: 1,
            property: 1,
            value: true,
            description: '',
            refs: [],
          },
        ],
        theorems: [
          {
            id: 1,
            when: { kind: 'atom', property: 1, value: true },
            then: { kind: 'atom', property: 2, value: true },
            description: '',
            refs: [],
          },
        ],
      },
    })

    await context.checked('S1')

    const { trait, proof } = get(context.traits).lookup({
      spaceId: 'S1',
      propertyId: 'P2',
      theorems: get(context.theorems),
    })!

    expect(trait?.value).toEqual(true)
    expect(proof?.theorems.map(t => t.id)).toEqual([1])
  })

  it('can wait for a space to be checked', async () => {
    const { checked } = setup({
      local: {
        spaces: [space({ id: 123 })],
      },
    })

    expect(checked('S123')).resolves.toBeUndefined()
  })

  describe('load', () => {
    let store: Writable<number>

    it('resolves when lookup finds value', async () => {
      store = writable(0)
      const context = setup()

      const loadPromise = context.load(store, n => (n > 10 ? n : false))

      store.set(5)
      store.set(13)

      await expect(loadPromise).resolves.toBe(13)
    })

    it('rejects when until promise resolves first', async () => {
      store = writable(0)
      const context = setup()

      const loadPromise = context.load(store, n => n > 0, Promise.resolve())

      await expect(loadPromise).rejects.toBeUndefined()
    })
  })
})
