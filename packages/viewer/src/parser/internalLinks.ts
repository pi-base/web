import type { Property, Space, Theorem, Traits } from '@/models'
import type { Finder } from './types'

export function internal(
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
  traits: Traits,
) {
  return function linker([kind, id]: ['S' | 'P' | 'T', string]) {
    switch (kind) {
      case 'S':
        // Support e.g. {S001|P002} as a link to the trait
        const match = /(?<sid>\d+)\|P(?<pid>\d+)/.exec(id)
        if (match?.groups) {
          const { sid, pid } = match.groups
          const space = spaces.find(Number(sid))
          const property = properties.find(Number(pid))
          const trait = space && property && traits.find(space, property)
          const connector =
            trait?.value === true
              ? 'is'
              : trait?.value === false
                ? 'is not'
                : '?'
          return {
            href: `/spaces/S${sid}/properties/P${pid}`,
            title: `${space ? space.name : 'S' + sid} ${connector} ${
              property ? property.name : 'P' + pid
            }`,
          }
        }

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
