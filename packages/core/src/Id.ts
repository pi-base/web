export type Id = string

export function traitId({ space, property }: { space: string, property: string }) {
  return `${space}|${property}`
}