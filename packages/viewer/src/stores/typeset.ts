import { Readable, get, readable } from 'svelte/store'

import type { Collection, Theorems } from '../models'
import { parser, externalLinks, internalLinks } from '../parser'
import type { Property, Space } from '../types'

type R<T> = Readable<Collection<T, string | number>>

export default function typeset(
  body: string,
  properties: R<Property>,
  spaces: R<Space>,
  theorems: Readable<Theorems>,
  truncate = false,
) {
  const parse = parser({
    linkers: {
      citation: externalLinks,
      internalLink: internalLinks(get(properties), get(spaces), get(theorems)),
    },
    truncate,
  })

  return readable(body, (set) => {
    parse(body).then(set)
  })
}
