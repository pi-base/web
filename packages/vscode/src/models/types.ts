import { z } from 'zod'
import { propertySchema, spaceSchema } from './schemas'

type Pad = '' | '0' | '00' | '000' | '0000' | '00000' | '00000'
type Id<Prefix extends string> = `${Prefix}${Pad}${number}`

export type SpaceId = Id<'S'>
export type PropertyId = Id<'P'>
export type TheoremId = Id<'T'>
export type TraitId = [SpaceId, PropertyId]
export type EntityId = SpaceId | PropertyId | TheoremId | TraitId

export const idExp = /[PST]\d{1,6}/g

export function isSpaceId(token: string): token is SpaceId {
  return token.match(/^S\d{1,6}$/) !== null
}

export function isPropertyId(token: string): token is PropertyId {
  return token.match(/^P\d{1,6}$/) !== null
}

export function isTheoremId(token: string): token is SpaceId {
  return token.match(/^T\d{1,6}$/) !== null
}

export function isTraitId(pair: [string, string]): pair is TraitId {
  return isSpaceId(pair[0]) && isPropertyId(pair[1])
}

export function normalizeId(id: SpaceId): SpaceId
export function normalizeId(id: PropertyId): PropertyId
export function normalizeId(id: string) {
  return `${id[0]}${id.slice(1).padStart(6, '0')}`
}

export type Property = z.infer<typeof propertySchema>
export type Space = z.infer<typeof spaceSchema>
