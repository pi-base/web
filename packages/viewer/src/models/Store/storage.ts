import { Id, SerializedBundle, bundle } from '@pi-base/core'

import { Proof, Store } from './state'

const storageKey = 'pibase.bundle'

type Serialized = {
  bundle: SerializedBundle,
  etag: string | null
  remote: {
    branch: string
    host: string
    state: Store['remote']['state']
    fetched: string
  }
  checked: Id[]
  proofs: [Id, Proof][]
}

function serialize(store: Store): Serialized {
  return {
    bundle: bundle.serialize(store.bundle),
    etag: store.etag,
    remote: {
      ...store.remote,
      fetched: store.remote.fetched.toString()
    },
    checked: Array.from(store.checked),
    proofs: Array.from(store.proofs.entries())
  }
}

function deserialize(serialized: Serialized): Store {
  return {
    bundle: bundle.deserialize(serialized.bundle || {}),
    etag: serialized.etag || null,
    remote: {
      ...serialized.remote,
      fetched: new Date(serialized.remote.fetched)
    },
    checked: new Set(serialized.checked || []),
    proofs: new Map(serialized.proofs || [])
  }
}

export function loadFromStorage(storage = localStorage): Store | undefined {
  const raw = storage.getItem(storageKey)
  if (!raw) { return }

  try {
    return deserialize(JSON.parse(raw))
  } catch (e) {
    localStorage.removeItem(storageKey)
    console.error(e) // TODO: send to Sentry
    return
  }
}

export function save(
  store: Store,
  storage = localStorage
) {
  storage.setItem(storageKey, JSON.stringify(serialize(store)))
}

type FetchOpts = {
  branch: string
  host: string
  etag?: string
}

export async function sync(
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
      proofs: new Map()
    }
  } else if (store) {
    return {
      ...store,
      remote: { ...store.remote, branch, host, fetched: new Date() }
    }
  }
}
