import Fuse from 'fuse.js'
import { Readable, derived } from 'svelte/store'

import type { Collection, Formula, Property, Space, Traits } from '../models'
import { read } from '../util'

export type Input = {
  text?: string
  formula?: Formula<Property>
}

export type Search = {
  search(input: Input): Space[]
}

export default function create({
  spaces,
  traits,
}: {
  spaces: Readable<Collection<Space>>
  traits: Readable<Traits>
}) {
  const index = derived(
    spaces,
    ($spaces) =>
      new Fuse($spaces.all, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'aliases', weight: 0.7 },
          { name: 'description', weight: 0.3 },
        ],
      }),
  )

  function search({ text = '', formula }: Input) {
    const searched =
      text.trim() === ''
        ? read(spaces).all
        : read(index)
            .search(text)
            .map((r) => r.item)

    if (formula) {
      const $traits = read(traits)
      return searched.filter((space) => $traits.evaluate({ formula, space }))
    } else {
      return searched
    }
  }

  return {
    search,
  }
}
