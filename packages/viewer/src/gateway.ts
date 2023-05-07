import * as pb from '@pi-base/core'

import {
  Id,
  type Property,
  type Space,
  type SerializedTheorem,
  type Trait,
} from './models'
import { trace } from './debug'

export type Sync = (
  host: string,
  branch: string,
  etag?: string,
) => Promise<Result | undefined>

export type Result = {
  spaces: Space[]
  properties: Property[]
  theorems: SerializedTheorem[]
  traits: Trait[]
  etag: string
  sha: string
}

export const sync: Sync = async (
  host: string,
  branch: string,
  etag?: string,
) => {
  trace({ event: 'remote_fetch_started', host, branch })
  const result = await pb.bundle.fetch({ host, branch, etag })

  if (result) {
    trace({ event: 'remote_fetch_complete', result })
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
}: pb.Theorem): SerializedTheorem {
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
