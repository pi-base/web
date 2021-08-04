import { Id, Property, Space, Theorem } from '../models'

export type Finder<T> = {
  find(id: number): T | null
}

export default function internalLinks(
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
) {
  return function linker(to: string) {
    const trimmed = (to || '').trim()
    if (!trimmed) {
      return
    }

    const tagged = Id.tag(trimmed)
    let space
    let property
    let theorem
    switch (tagged?.kind) {
      case 'space':
        space = spaces.find(tagged.id)
        if (space) {
          return {
            href: `/spaces/${Id.format('S', space.id)}`,
            label: space.name,
          }
        } else {
          return `Could not find Space ${trimmed}`
        }

      case 'property':
        property = properties.find(tagged.id)
        if (property) {
          return {
            href: `/properties/${Id.format('P', property.id)}`,
            label: property.name,
          }
        } else {
          return `Could not find Property ${trimmed}`
        }

      case 'theorem':
        theorem = theorems.find(tagged.id)
        if (theorem) {
          const uid = Id.format('T', theorem.id)
          return {
            href: `/theorems/${uid}`,
            label: `Theorem ${uid}`,
          }
        } else {
          return `Could not find Theorem ${trimmed}`
        }

      default:
        return `Could not parse ${trimmed} as an ID`
    }
  }
}
