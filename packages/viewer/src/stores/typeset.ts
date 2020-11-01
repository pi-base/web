import { Readable, get, readable } from 'svelte/store'

import { parser, externalLinks, internalLinks } from '../parser'
import type { Collection } from '../stores/collection'
import type { Property, Space, Theorem } from '../types'

type R<T> = Readable<Collection<T, string | number>>

export default function typeset(
  body: string,
  properties: R<Property>,
  spaces: R<Space>,
  theorems: R<Theorem>,
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
