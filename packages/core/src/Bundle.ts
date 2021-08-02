import { z } from 'zod'
import { Id, traitId } from './Id'
import { Property } from './Property'
import { Space } from './Space'
import { Theorem } from './Theorem'
import { Trait } from './Trait'

export const defaultHost = 'https://pi-base-bundles.s3.us-east-2.amazonaws.com'

export const Version = z.object({
  ref: z.string(),
  sha: z.string(),
})

export type Version = z.infer<typeof Version>

export type Bundle = {
  properties: Map<Id, Property>
  spaces: Map<Id, Space>
  traits: Map<Id, Trait<Id>>
  theorems: Map<Id, Theorem>
  version: Version
}

const Serialized = z.object({
  properties: z.array(Property),
  spaces: z.array(Space),
  theorems: z.array(Theorem),
  traits: z.array(Trait),
  version: Version,
})

export type Serialized = z.infer<typeof Serialized>

export function serialize(bundle: Bundle): Serialized {
  return {
    properties: [...bundle.properties.values()],
    spaces: [...bundle.spaces.values()],
    theorems: [...bundle.theorems.values()],
    traits: [...bundle.traits.values()],
    version: bundle.version,
  }
}

export function deserialize(data: unknown): Bundle {
  const { spaces, properties, theorems, traits, version } =
    Serialized.parse(data)

  return {
    properties: indexBy(properties, (p) => p.uid),
    spaces: indexBy(spaces, (s) => s.uid),
    theorems: indexBy(theorems, (t) => t.uid),
    traits: indexBy(traits, traitId),
    version,
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
