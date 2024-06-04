export type Id = string
export type TraitId = { space: string; property: string }

export type Tagged =
  | SpaceId
  | PropertyId
  | TheoremId
  | { kind: 'trait'; space: number; property: number }

export type SpaceId = { kind: 'space'; id: number }
export type PropertyId = { kind: 'property'; id: number }
export type TheoremId = { kind: 'theorem'; id: number }

const pattern = /^(?<prefix>[spti])0*(?<id>\d+)/i

export function traitId({ space, property }: TraitId): string {
  return `${space}|${property}`
}

export function format(prefix: string, number: number): string {
  return `${prefix}${number.toString().padStart(6, '0')}`
}

export function trim(id: string): string {
  const match = pattern.exec(id)
  return match?.groups ? match.groups.id : id
}

export function tag(input: string): Tagged | null {
  const match = pattern.exec(input)
  if (!match || !match.groups) {
    return null
  }

  const id = parseInt(match.groups.id)
  switch (match.groups.prefix.toUpperCase()) {
    case 'S':
      return { kind: 'space', id }
    case 'P':
      return { kind: 'property', id }
    case 'T':
    case 'I':
      return { kind: 'theorem', id }
    default:
      return null
  }
}

export function toInt(id: string): number {
  const tagged = tag(id)
  if (tagged === null || tagged.kind === 'trait') {
    return 0
  } // TODO: return undefined

  return tagged.id
}

// TODO: these were extracted from other parallel-but-divergent implementations
// and should be unified.

type Pad = '' | '0' | '00' | '000' | '0000' | '00000' | '00000'
type XId<Prefix extends string> = `${Prefix}${Pad}${number}`

export type SId = XId<'S'>
export type PId = XId<'P'>
export type TId = XId<'T'>
export type SPId = [SId, PId]
export type EntityId = SId | PId | TId | SPId

export function isSpaceId(token: string): token is SId {
  return token.match(/^S\d{1,6}$/) !== null
}

export function isPropertyId(token: string): token is PId {
  return token.match(/^P\d{1,6}$/) !== null
}

export function isTheoremId(token: string): token is SId {
  return token.match(/^T\d{1,6}$/) !== null
}

export function isTraitId(pair: [string, string]): pair is SPId {
  return isSpaceId(pair[0]) && isPropertyId(pair[1])
}

export const idExp = /[PST]\d{1,6}/g

export function normalizeId(id: SId): SId
export function normalizeId(id: PId): PId
export function normalizeId(id: string) {
  return `${id[0]}${id.slice(1).padStart(6, '0')}`
}
