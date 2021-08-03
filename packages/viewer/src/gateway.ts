import * as pb from '@pi-base/core'

import { Id, Property, Space, SerializedTheorem, Trait } from './models'
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
      spaces: result.bundle.spaces.map(space),
      properties: result.bundle.properties.map(property),
      traits: result.bundle.traits.map(trait),
      theorems: result.bundle.theorems.map(theorem),
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
    aliases: aliases || [],
    description,
    refs: refs || [],
  }
}

function space({ uid, name, aliases, description, refs }: pb.Space): Space {
  return {
    id: Id.toInt(uid),
    name,
    aliases: aliases || [],
    description,
    refs: refs || [],
  }
}

function trait({ space, property, value, description, refs }: pb.Trait): Trait {
  return {
    asserted: true,
    space: Id.toInt(space),
    property: Id.toInt(property),
    value,
    description,
    refs: refs || [],
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
    refs: refs || [],
  }
}
