import { Id, bundle } from '@pi-base/core'

import { Store } from './state'

const storageKey = 'pibase.bundle'

const defaultHost = process.env.REACT_APP_BUNDLE_HOST || 'http://localhost:3141'

function loadFromStorage(storage = localStorage): Store | undefined {
  const raw = storage.getItem(storageKey)
  if (!raw) { return }

  try {
    const parsed = JSON.parse(raw)
    return {
      ...bundle.deserialize(parsed),
      checked: new Set(parsed.checked || [])
    }
  } catch (e) {
    console.error(e) // TODO: send to Sentry
    return
  }
}

export function save(
  store: Store,
  storage = localStorage
) {
  const serialized = { ...bundle.serialize(store), checked: Array.from(store.checked) }
  storage.setItem(storageKey, JSON.stringify(serialized))
}

async function loadFromRemote(
  opts: {
    branch: string
    host?: string
  }
) {
  const b = await bundle.fetch(opts)
  return {
    ...b,
    checked: new Set<Id>()
  }
}

export async function load(
  branch: string,
  storage = localStorage
): Promise<Store | undefined> {
  let fetched = loadFromStorage(storage)
  if (!fetched) {
    fetched = await loadFromRemote({ branch, host: defaultHost })
    if (fetched) { save(fetched, storage) }
  }
  return fetched
}
