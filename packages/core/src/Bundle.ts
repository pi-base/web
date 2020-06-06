import { Id, traitId } from './Id'
import { Property } from './Property'
import { Space } from './Space'
import { Theorem } from './Theorem'
import { Trait, Proof } from './Trait'
import { ImplicationIndex, Prover } from './Logic'

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

export async function fetch(
  opts: FetchOpts
): Promise<{ bundle: Bundle; etag: string } | undefined> {
  const headers = new Headers()
  if (opts.etag) {
    headers.append('If-None-Match', opts.etag)
  }
  const response = await window.fetch(bundleUrl(opts), { method: 'GET', headers })
  if (response.status === 304) {
    return
  }

  const json = await response.json()
  const deserialized = deserialize(json)

  if (JSON.stringify(serialize(deserialized)) != JSON.stringify(json)) {
    throw new Error('Data serialization failure')
  }

  return {
    bundle: deserialized,
    etag: response.headers.get('etag') || ''
  }
}

function indexBy<K, V>(collection: V[], key: (value: V) => K): Map<K, V> {
  return new Map(collection.map((value: V) => [key(value), value]))
}

type CheckResult =
  | { kind: 'bundle'; bundle: Bundle }
  | { kind: 'contradiction'; contradiction: Proof }

export function check(
  bundle: Bundle,
  space: Space,
  implications?: ImplicationIndex<Theorem>
): CheckResult {
  if (!implications) {
    implications = new ImplicationIndex(Array.from(bundle.theorems.values()))
  }

  const traitMap = new Map<Id, boolean>()
  bundle.properties.forEach((_, property) => {
    const trait = bundle.traits.get(traitId({ space: space.uid, property }))
    if (!trait) {
      return
    }

    traitMap.set(property, trait.value)
  })

  const prover = new Prover(implications, traitMap)
  const contradiction = prover.run()
  if (contradiction) {
    return { kind: 'contradiction', contradiction }
  }

  const { proofs = [] } = prover.derivations()

  const newTraits: Map<Id, Trait> = new Map()

  proofs.forEach(({ property, value, proof }) => {
    const uid = traitId({ space: space.uid, property })
    const trait = {
      uid,
      counterexamples_id: undefined,
      space: space.uid,
      property,
      value,
      proof,
      description: '',
      refs: []
    }
    newTraits.set(uid, trait)
  })

  return {
    kind: 'bundle',
    bundle: {
      ...bundle,
      traits: new Map([
        ...Array.from(bundle.traits.entries()),
        ...Array.from(newTraits.entries())
      ])
    }
  }
}
