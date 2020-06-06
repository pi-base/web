export type Id = string
export type TraitId = {space: string; property: string}

export function traitId({space, property}: TraitId) {
  return `${space}|${property}`
}
