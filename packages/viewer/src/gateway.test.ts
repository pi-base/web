import { bundle } from '@pi-base/core'
import * as debug from './debug'

import { sync } from './gateway'

const trace = jest.spyOn(debug, 'trace')

it('can fetch successfully', async () => {
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

  jest.spyOn(bundle, 'fetch').mockImplementation(async () => remote)

  const result = await sync('example', 'test')

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

it('notifies if the etag matches', async () => {
  const current = {
    spaces: [],
    properties: [],
    theorems: [],
    traits: [],
    etag: 'etag',
    sha: 'sha',
  }

  jest.spyOn(bundle, 'fetch').mockImplementation(async () => undefined)

  const result = await sync('example', 'test', current.etag)

  expect(result).toEqual(undefined)
  expect(trace.mock.calls).toEqual([
    [{ event: 'remote_fetch_started', host: 'example', branch: 'test' }],
    [{ event: 'bundle_unchanged', etag: 'etag' }],
  ])
})
