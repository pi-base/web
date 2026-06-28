import * as pb from '@pi-base/core'

import { Id, type Property, type Space, type Trait } from './models'
import { serverLog, trace } from './debug'

export type Sync = (
  host: string,
  branch: string,
  etag?: string,
) => Promise<Result | undefined>

export type Result = {
  spaces: Space[]
  properties: Property[]
  theorems: pb.SerializedTheorem[]
  traits: Trait[]
  etag: string
  sha: string
}

export function sync(
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  bundle?: pb.Bundle,
): Sync {
  return async (host: string, branch: string, etag?: string) => {
    trace({ event: 'remote_fetch_started', host, branch })
    // `ms` wraps the network fetch — real I/O, so the Workers clock advances and
    // this is a trustworthy duration (unlike CPU-bound timings). Faithful to
    // current behaviour: there is no isolate bundle cache, so every SSR request
    // re-fetches and (on a 200) re-parses/transforms the whole bundle.
    const startedAt = Date.now()
    const result = bundle
      ? { bundle, etag: 'etag' }
      : await pb.bundle.fetch({ host, branch, etag, fetch })
    const ms = Date.now() - startedAt

    if (result) {
      trace({ event: 'remote_fetch_complete', result })
      const { spaces, properties, theorems, traits } = result.bundle
      serverLog({
        evt: 'bundle_sync',
        changed: true,
        spaces: spaces.size,
        properties: properties.size,
        theorems: theorems.size,
        traits: traits.size,
        ms,
      })
      return {
        spaces: transform(space, result.bundle.spaces),
        properties: transform(property, result.bundle.properties),
        traits: transform(trait, result.bundle.traits),
        theorems: transform(theorem, result.bundle.theorems),
        etag: result.etag,
        sha: result.bundle.version.sha,
      }
    } else if (etag) {
      trace({ event: 'bundle_unchanged', etag })
      serverLog({
        evt: 'bundle_sync',
        changed: false,
        spaces: 0,
        properties: 0,
        theorems: 0,
        traits: 0,
        ms,
      })
    }
  }
}

function property({
  uid,
  name,
  aliases,
  description,
  refs,
}: pb.Property): Property {
  return {
    id: Id.toInt(uid),
    name,
    aliases,
    description,
    refs,
  }
}

function space({ uid, name, aliases, description, refs }: pb.Space): Space {
  return {
    id: Id.toInt(uid),
    name,
    aliases,
    description,
    refs,
  }
}

function trait({ space, property, value, description, refs }: pb.Trait): Trait {
  return {
    asserted: true,
    space: Id.toInt(space),
    property: Id.toInt(property),
    value,
    description,
    refs,
  }
}

function theorem({
  uid,
  when,
  then,
  description,
  refs,
}: pb.Theorem): pb.SerializedTheorem {
  return {
    id: Id.toInt(uid),
    when: pb.formula.mapProperty(Id.toInt, when),
    then: pb.formula.mapProperty(Id.toInt, then),
    description,
    refs,
  }
}

function transform<U, V>(f: (u: U) => V, collection: Map<unknown, U>): V[] {
  return [...collection.values()].map(f)
}
