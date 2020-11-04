import { tag } from '@pi-base/core/lib/Id'

import type { Collection, Theorems } from '../models'
import type { Property, Space } from '../types'

export default function internalLinks(
  properties: Collection<Property>,
  spaces: Collection<Space>,
  theorems: Theorems,
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
            href: `/spaces/${space.uid}`,
            label: space.name,
          }
        } else {
          return `Could not find Space ${to}`
        }

      case 'property':
        const property = properties.find(tagged.id)
        if (property) {
          return {
            href: `/properties/${property.uid}`,
            label: property.name,
          }
        } else {
          return `Could not find Property ${to}`
        }

      case 'theorem':
        const theorem = theorems.find(tagged.id)
        if (theorem) {
          return {
            href: `/theorems/${theorem.uid}`,
            label: `Theorem ${theorem.uid}`,
          }
        } else {
          return `Could not find Theorem ${to}`
        }

      default:
        return `Could not parse ${to} as an ID`
    }
  }
}
