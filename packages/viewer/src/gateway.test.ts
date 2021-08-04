import { jest } from '@jest/globals'
import { bundle } from '@pi-base/core'
// import * as debug from './debug'

import { sync } from './gateway'

// const trace = jest.spyOn(debug, 'trace')

it.skip('can fetch successfully', async () => {
  const remote = {
    bundle: bundle.deserialize({
      spaces: [],
      properties: [],
      theorems: [],
      traits: [],
      version: { sha: 'sha', ref: 'ref' },
    }),
    etag: 'etag',
  }

  jest.spyOn(bundle, 'fetch').mockImplementation(() => Promise.resolve(remote))

  const result = await sync('example', 'test')

  expect(result).toEqual({
    spaces: [],
    properties: [],
    traits: [],
    theorems: [],
    etag: 'etag',
    sha: 'sha',
  })
  // expect(trace.mock.calls).toEqual([
  //   [{ event: 'remote_fetch_started', host: 'example', branch: 'test' }],
  //   [{ event: 'remote_fetch_complete', result: remote }],
  // ])
})

it.skip('notifies if the etag matches', async () => {
  const current = {
    spaces: [],
    properties: [],
    theorems: [],
    traits: [],
    etag: 'etag',
    sha: 'sha',
  }

  jest
    .spyOn(bundle, 'fetch')
    .mockImplementation(() => Promise.resolve(undefined))

  const result = await sync('example', 'test', current.etag)

  expect(result).toEqual(undefined)
  // expect(trace.mock.calls).toEqual([
  //   [{ event: 'remote_fetch_started', host: 'example', branch: 'test' }],
  //   [{ event: 'bundle_unchanged', etag: 'etag' }],
  // ])
})
