import { Id, traitId } from './Id.js'
import { Property } from './Property.js'
import { Space } from './Space.js'
import { Theorem } from './Theorem.js'
import { Trait } from './Trait.js'

export const defaultHost = 'https://pi-base-bundles.s3.us-east-2.amazonaws.com'

export type Version = {
  ref: string
  sha: string
}

export type Bundle = {
  properties: Map<Id, Property>
  spaces: Map<Id, Space>
  traits: Map<Id, Trait<Id>>
  theorems: Map<Id, Theorem>
  version: Version
}

export type Serialized = {
  properties: Property[]
  spaces: Space[]
  theorems: Theorem[]
  traits: Trait<Id>[]
  version: Version
}

export function serialize(bundle: Bundle): Serialized {
  return {
    properties: [...bundle.properties.values()],
    spaces: [...bundle.spaces.values()],
    theorems: [...bundle.theorems.values()],
    traits: [...bundle.traits.values()],
    version: bundle.version,
  }
}

export function deserialize(serialized: Serialized): Bundle {
  return {
    properties: indexBy(serialized.properties, (p) => p.uid),
    spaces: indexBy(serialized.spaces, (s) => s.uid),
    theorems: indexBy(serialized.theorems, (t) => t.uid),
    traits: indexBy(serialized.traits, traitId),
    version: serialized.version,
  }
}

type FetchOpts = {
  branch: string
  host?: string
  etag?: string
}

export function bundleUrl({ branch, host = defaultHost }: FetchOpts): string {
  return `${host}/refs/heads/${branch}.json`
}

export async function fetch(
  opts: FetchOpts,
): Promise<{ bundle: Bundle; etag: string } | undefined> {
  const headers = new Headers()
  if (opts.etag) {
    headers.append('If-None-Match', opts.etag)
  }
  const response = await window.fetch(bundleUrl(opts), {
    method: 'GET',
    headers,
  })
  if (response.status === 304) {
    return
  }

  // TODO: use a schema definition to handle validation failures
  // eslint-disable-next-line
  const json = await response.json()
  const deserialized = deserialize(json)

  if (JSON.stringify(serialize(deserialized)) != JSON.stringify(json)) {
    throw new Error('Data serialization failure')
  }

  return {
    bundle: deserialized,
    etag: response.headers.get('etag') || '',
  }
}

function indexBy<K, V>(collection: V[], key: (value: V) => K): Map<K, V> {
  return new Map(collection.map((value: V) => [key(value), value]))
}
