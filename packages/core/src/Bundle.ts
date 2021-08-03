import { z } from 'zod'
import { Id, traitId } from './Id'
import { ImplicationIndex } from './Logic'
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

export class Bundle {
  private readonly _properties: Map<Id, Property>
  private readonly _spaces: Map<Id, Space>
  private readonly _theorems: Map<Id, Theorem>
  private readonly _traits: Map<Id, Trait>

  static deserialize(data: Serialized): Bundle {
    const { spaces, properties, theorems, traits, version } = data

    return new Bundle(properties, spaces, theorems, traits, version)
  }

  constructor(
    properties: Property[],
    spaces: Space[],
    theorems: Theorem[],
    traits: Trait[],
    readonly version: Version,
  ) {
    this._properties = indexBy(properties, (p) => p.uid)
    this._spaces = indexBy(spaces, (s) => s.uid)
    this._theorems = indexBy(theorems, (t) => t.uid)
    this._traits = indexBy(traits, traitId)
  }

  get properties(): Property[] {
    return Array.from(this._properties.values())
  }

  get spaces(): Space[] {
    return Array.from(this._spaces.values())
  }

  get theorems(): Theorem[] {
    return Array.from(this._theorems.values())
  }

  get traits(): Trait[] {
    return Array.from(this._traits.values())
  }

  property(uid: Id): Property | null {
    return this._properties.get(uid) ?? null
  }

  space(uid: Id): Space | null {
    return this._spaces.get(uid) ?? null
  }

  theorem(uid: Id): Theorem | null {
    return this._theorems.get(uid) ?? null
  }

  trait(key: { space: Id; property: Id }): Trait | null {
    return this._traits.get(traitId(key)) ?? null
  }

  traitMap(
    options: { property: Property } | { space: Space },
  ): Map<Id, boolean> {
    const map = new Map<Id, boolean>()

    if ('property' in options) {
      for (const space of this.spaces) {
        const trait = this.trait({
          space: space.uid,
          property: options.property.uid,
        })
        if (trait) {
          map.set(space.uid, trait.value)
        }
      }
    } else {
      for (const property of this.properties) {
        const trait = this.trait({
          space: options.space.uid,
          property: property.uid,
        })
        if (trait) {
          map.set(property.uid, trait.value)
        }
      }
    }

    return map
  }

  get implications(): ImplicationIndex {
    return new ImplicationIndex(
      this.theorems.map(({ uid: id, when, then }) => ({ id, when, then })),
    )
  }
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
    properties: bundle.properties,
    spaces: bundle.spaces,
    theorems: bundle.theorems,
    traits: bundle.traits,
    version: bundle.version,
  }
}

export function deserialize(data: unknown): Bundle {
  return Bundle.deserialize(Serialized.parse(data))
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
