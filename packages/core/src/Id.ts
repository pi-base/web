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
  const match = id.match(pattern)
  return match?.groups ? match.groups.id : id
}

export function tag(input: string): Tagged | null {
  const match = input.match(pattern)
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
