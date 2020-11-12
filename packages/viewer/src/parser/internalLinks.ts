import { tag } from '@pi-base/core/lib/Id'

import { Id, Property, Space, Theorem } from '../models'

export type Finder<T> = {
  find(id: number): T | null
}

export default function internalLinks(
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
) {
  return function linker({ to }: { to?: string }) {
    const trimmed = (to || '').trim()
    if (!trimmed) {
      return
    }

    const tagged = tag(trimmed)
    switch (tagged?.kind) {
      case 'space':
        const space = spaces.find(tagged.id)
        if (space) {
          return {
            href: `/spaces/${Id.format('S', space.id)}`,
            label: space.name,
          }
        } else {
          return `Could not find Space ${to}`
        }

      case 'property':
        const property = properties.find(tagged.id)
        if (property) {
          return {
            href: `/properties/${Id.format('P', property.id)}`,
            label: property.name,
          }
        } else {
          return `Could not find Property ${to}`
        }

      case 'theorem':
        const theorem = theorems.find(tagged.id)
        if (theorem) {
          const uid = Id.format('T', theorem.id)
          return {
            href: `/theorems/${uid}`,
            label: `Theorem ${uid}`,
          }
        } else {
          return `Could not find Theorem ${to}`
        }

      default:
        return `Could not parse ${to} as an ID`
    }
  }
}
