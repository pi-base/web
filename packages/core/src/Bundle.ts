import { Id, traitId } from './Id'
import { Property } from './Property'
import { Space } from './Space'
import { Theorem } from './Theorem'
import { Trait } from './Trait'

export const defaultHost = 'https://pi-base-bundles.s3.us-east-2.amazonaws.com'

export type Version = {
  ref: string
  sha: string
}

export type Bundle = {
  properties: Map<Id, Property>
  spaces: Map<Id, Space>
  traits: Map<Id, Trait>
  theorems: Map<Id, Theorem>
  version: Version
}

export type Serialized = {
  properties: Property[]
  spaces: Space[]
  theorems: Theorem[]
  traits: Trait[]
  version: Version
}

export function serialize(bundle: Bundle): Serialized {
  return {
    properties: Array.from(bundle.properties.values()),
    spaces: Array.from(bundle.spaces.values()),
    theorems: Array.from(bundle.theorems.values()),
    traits: Array.from(bundle.traits.values()),
    version: bundle.version
  }
}

export function deserialize(serialized: Serialized): Bundle {
  return {
    properties: indexBy(serialized.properties, p => p.uid),
    spaces: indexBy(serialized.spaces, s => s.uid),
    theorems: indexBy(serialized.theorems, t => t.uid),
    traits: indexBy(serialized.traits, traitId),
    version: serialized.version
  }
}

type FetchOpts = {
  branch: string
  host?: string
  etag?: string
}

export function bundleUrl({ branch, host = defaultHost }: FetchOpts) {
  return `${host}/refs/heads/${branch}.json`
}

export async function fetch(opts: FetchOpts): Promise<{ bundle: Bundle, etag: string } | undefined> {
  const headers = new Headers()
  if (opts.etag) { headers.append('If-None-Match', opts.etag) }
  const response = await window.fetch(bundleUrl(opts), { method: 'GET', headers })
  if (response.status === 304) { return }

  const json = await response.json()
  // TODO: validate returned data
  return {
    bundle: deserialize(json),
    etag: response.headers.get('etag') || ''
  }
}

function indexBy<K, V>(collection: V[], key: (value: V) => K): Map<K, V> {
  return new Map(collection.map((value: V) => [key(value), value]))
}
