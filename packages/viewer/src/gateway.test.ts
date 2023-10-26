import { expect, it, vi } from 'vitest'
import { bundle } from '@pi-base/core'

import * as debug from './debug'

import { sync } from './gateway'

const trace = vi.spyOn(debug, 'trace')

it.todo('can fetch successfully', async () => {
  const remote = {
    bundle: {
      spaces: new Map(),
      properties: new Map(),
      theorems: new Map(),
      traits: new Map(),
      version: { sha: 'sha', ref: 'ref' },
    },
    etag: 'etag',
  }

  vi.spyOn(bundle, 'fetch').mockImplementation(async () => remote)

  const result = await sync(fetch)('example', 'test')

  expect(result).toEqual({
    spaces: [],
    properties: [],
    traits: [],
    theorems: [],
    etag: 'etag',
    sha: 'sha',
  })
  expect(trace.mock.calls).toEqual([
    [{ event: 'remote_fetch_started', host: 'example', branch: 'test' }],
    [{ event: 'remote_fetch_complete', result: remote }],
  ])
})

it.todo('notifies if the etag matches', async () => {
  const current = {
    spaces: [],
    properties: [],
    theorems: [],
    traits: [],
    etag: 'etag',
    sha: 'sha',
  }

  vi.spyOn(bundle, 'fetch').mockImplementation(async () => undefined)

  const result = await sync(fetch)('example', 'test', current.etag)

  expect(result).toEqual(undefined)
  expect(trace.mock.calls).toEqual([
    [{ event: 'remote_fetch_started', host: 'example', branch: 'test' }],
    [{ event: 'bundle_unchanged', etag: 'etag' }],
  ])
})
