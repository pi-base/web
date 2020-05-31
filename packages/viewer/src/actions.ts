import React from 'react'

import { Space } from './models'
import { Store, uncheckedSpaces } from './models/Store'
import * as storage from './models/Store/storage'
import { defaultHost } from './models/Store/state'

export { save } from './models/Store/storage'

// TODO:
// * clean these up
// * make sure reducer implementation is consistent
// * test reducer and actions directly
export type Action
  = { action: 'loadError' } // TODO: handle this
  | { action: 'loaded', value: Store }
  | { action: 'checking', count: number }
  | { action: 'check', space: Space }
  | { action: 'ready' }
  | { action: 'fetching', branch: string, host: string }
  | { action: 'fetchError', error: Error }

export async function boot(
  dispatch: React.Dispatch<Action>
) {
  const loaded = storage.loadFromStorage()
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

async function check({
  dispatch,
  store
}: {
  dispatch: React.Dispatch<Action>
  store: Store
}) {
  const toCheck = uncheckedSpaces(store)
  dispatch({ action: 'checking', count: toCheck.length })

  for (let i = 0; i < toCheck.length; i++) {
    dispatch({ action: 'check', space: toCheck[i] })
    await pause()
  }

  dispatch({ action: 'ready' })
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
  dispatch({ action: 'fetching', branch, host })

  try {
    const next = await storage.sync(store, { branch, host })
    if (!next) { return } // Bundle was unchanged

    dispatch({ action: 'loaded', value: next })
    check({ store: next, dispatch })
  } catch (error) {
    dispatch({ action: 'fetchError', error })
  }
}
