import Fuse from 'fuse.js'
import { Readable, derived, get as _get } from 'svelte/store'

import type { Collection, Traits } from '../models'
import type { Formula, Property, Space } from '../types'

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
        ? get<Collection<Space>>(spaces).all
        : get<Fuse<Space>>(index)
            .search(text)
            .map((r) => r.item)

    if (formula) {
      const $traits = get<Traits>(traits)
      return searched.filter((space) => $traits.evaluate({ formula, space }))
    } else {
      return searched
    }
  }

  return {
    search,
  }
}

const get = <T>(store: Readable<T>): T => _get<T, Readable<T>>(store)
