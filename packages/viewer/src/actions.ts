import React from 'react'

import { bundle } from '@pi-base/core'
import { Space } from './models'
import * as Error from './errors'
import { Store, uncheckedSpaces } from './models/Store'
import * as storage from './models/Store/storage'
import { defaultHost } from './models/Store/state'

export { save } from './models/Store/storage'

export type Action
  = { action: 'loaded', value: Store }
  | { action: 'check.started', count: number }
  | { action: 'check', space: Space }
  | { action: 'check.done' }
  | { action: 'fetch.started', branch: string, host: string }
  | { action: 'fetch.error', error: Error }

export type Dispatch = React.Dispatch<Action>

export async function boot(
  dispatch: React.Dispatch<Action>,
  errorHandler: Error.Handler
) {
  let loaded
  try {
    loaded = storage.loadFromStorage()
  } catch (e) {
    errorHandler.error(e)
  }

  if (loaded) {
    dispatch({ action: 'loaded', value: loaded })
  }
  await refresh({
    dispatch,
    branch: loaded?.remote?.branch || 'master',
    host: loaded?.remote?.host || defaultHost,
    store: loaded
  })
}

async function pause(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 0)
  })
}

export async function check({
  dispatch,
  store
}: {
  dispatch: React.Dispatch<Action>
  store: Store
}) {
  const spaces = uncheckedSpaces(store)
  dispatch({ action: 'check.started', count: spaces.length })

  for (const space of spaces) {
    dispatch({ action: 'check', space })
    await pause()
  }

  dispatch({ action: 'check.done' })
}

export async function refresh(
  {
    branch,
    dispatch,
    host,
    store
  }: {
    branch: string
    dispatch: React.Dispatch<Action>
    host: string
    store: Store | undefined
  }
) {
  dispatch({ action: 'fetch.started', branch, host })

  try {
    const next = await sync(store, { branch, host })
    if (!next) { return } // Bundle was unchanged

    dispatch({ action: 'loaded', value: next })
    check({ store: next, dispatch })
  } catch (error) {
    dispatch({ action: 'fetch.error', error })
  }
}

type FetchOpts = {
  branch: string
  host: string
  etag?: string
}

async function sync(
  store: Store | undefined,
  { branch, host }: FetchOpts
): Promise<Store | undefined> {
  const fetched = await bundle.fetch({
    branch,
    host,
    etag: store?.etag || undefined
  })

  if (fetched) {
    return {
      bundle: fetched.bundle,
      etag: fetched.etag,
      remote: {
        branch,
        host,
        state: 'done',
        fetched: new Date()
      },
      checked: new Set(),
      error: null
    }
  } else if (store) {
    return {
      ...store,
      remote: { ...store.remote, branch, host, fetched: new Date() }
    }
  }
}