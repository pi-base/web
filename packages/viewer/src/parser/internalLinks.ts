import type { Property, Space, Theorem } from '@/models'
import type { Finder } from './types'

export function internal(
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
) {
  return function linker([kind, id]: ['S' | 'P' | 'T', string]) {
    switch (kind) {
      case 'S':
        const space = spaces.find(Number(id))
        return {
          href: `/spaces/S${id}`,
          title: space ? space.name : `S${id}`,
        }
      case 'P':
        const property = properties.find(Number(id))
        return {
          href: `/properties/P${id}`,
          title: property ? property.name : `P${id}`,
        }
      case 'T':
        const theorem = theorems.find(Number(id))
        return {
          href: `/theorems/T${id}`,
          title: theorem ? theorem.name : `T${id}`,
        }
    }
  }
}
