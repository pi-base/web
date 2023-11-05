import Fuse from 'fuse.js'
import { type Readable, derived, writable } from 'svelte/store'

import type { Collection, Formula, Property, Space, Traits } from '@/models'
import { read } from '@/util'

export type Input = {
  text?: string
  formula?: Formula<Property>
}

export type Search = Readable<Space[]> & {
  search(input: Input): void
}

export default function create({
  spaces,
  traits,
}: {
  spaces: Readable<Collection<Space>>
  traits: Readable<Traits>
}) {
  const input = writable<Input>({})

  const index = derived(
    spaces,
    $spaces =>
      new Fuse($spaces.all, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'aliases', weight: 0.7 },
          { name: 'description', weight: 0.3 },
        ],
      }),
  )

  const { subscribe } = derived(
    [index, traits, input],
    ([$index, $traits, { text = '', formula }]) => {
      const searched =
        text.trim() === ''
          ? read(spaces).all
          : $index.search(text).map(r => r.item)

      if (formula) {
        return searched.filter(space => $traits.evaluate({ formula, space }))
      } else {
        return searched
      }
    },
  )

  return {
    search: input.set,
    subscribe,
  }
}
