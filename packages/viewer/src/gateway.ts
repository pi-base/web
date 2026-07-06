import { browser } from '$app/environment'
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

// Isolate-level cache of the parsed + transformed bundle, keyed by source. A
// warm Cloudflare Worker isolate serves many SSR requests; caching here lets
// them reuse the parse/transform work and revalidate cheaply against the S3
// ETag (a conditional request → 304) instead of re-downloading and re-parsing
// on every request. We only cache during SSR — client-side the store already
// persists to localStorage.
//
// Bounded so a parsed bundle (the whole dataset) can't accumulate unbounded in
// a long-lived isolate: a site serves a single host/branch, so in practice this
// holds one entry, and we keep at most the few most-recently used.
const SSR_CACHE_MAX = 2
const ssrCache = new Map<string, { etag: string; result: Result }>()

function cacheBundle(key: string, etag: string, result: Result): void {
  // Re-insert to mark most-recently used, then evict the oldest over the cap.
  ssrCache.delete(key)
  ssrCache.set(key, { etag, result })
  if (ssrCache.size > SSR_CACHE_MAX) {
    const oldest = ssrCache.keys().next().value
    if (oldest !== undefined) {
      ssrCache.delete(oldest)
    }
  }
}

export function sync(
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  bundle?: pb.Bundle,
): Sync {
  return async (host: string, branch: string, etag?: string) => {
    trace({ event: 'remote_fetch_started', host, branch })

    // A warm isolate may already hold the parsed bundle; pass its ETag so an
    // unchanged source costs a conditional request instead of a re-parse. An
    // injected bundle (tests/prerender) is never cached against the live source.
    const key = `${host}/${branch}`
    const warm = browser || bundle ? undefined : ssrCache.get(key)

    // `ms` wraps the network fetch — real I/O, so the Workers clock advances and
    // this is a trustworthy duration (unlike CPU-bound timings).
    const startedAt = Date.now()
    const result = bundle
      ? { bundle, etag: 'etag' }
      : await pb.bundle.fetch({ host, branch, etag: etag ?? warm?.etag, fetch })
    const ms = Date.now() - startedAt

    if (result) {
      trace({ event: 'remote_fetch_complete', result })
      const { spaces, properties, theorems, traits } = result.bundle
      serverLog({
        evt: 'bundle_sync',
        changed: true,
        cached: false,
        spaces: spaces.size,
        properties: properties.size,
        theorems: theorems.size,
        traits: traits.size,
        ms,
      })
      const transformed = build(result.bundle, result.etag)
      if (!browser && !bundle) {
        cacheBundle(key, result.etag, transformed)
      }
      return transformed
    } else if (warm) {
      // 304 Not Modified — reuse the transform this isolate already parsed.
      serverLog({
        evt: 'bundle_sync',
        changed: false,
        cached: true,
        spaces: 0,
        properties: 0,
        theorems: 0,
        traits: 0,
        ms,
      })
      return warm.result
    } else if (etag) {
      trace({ event: 'bundle_unchanged', etag })
      serverLog({
        evt: 'bundle_sync',
        changed: false,
        cached: false,
        spaces: 0,
        properties: 0,
        theorems: 0,
        traits: 0,
        ms,
      })
    }
  }
}

function build(bundle: pb.Bundle, etag: string): Result {
  return {
    spaces: transform(space, bundle.spaces),
    properties: transform(property, bundle.properties),
    traits: transform(trait, bundle.traits),
    theorems: transform(theorem, bundle.theorems),
    etag,
    sha: bundle.version.sha,
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
