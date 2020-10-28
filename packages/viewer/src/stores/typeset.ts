import { Readable, get, readable } from 'svelte/store'
import type { Property, Space, Theorem } from '@pi-base/core'

import { parser, externalLinks, internalLinks } from '../parser'
import type { Collection } from '../stores/collection'

type R<T> = Readable<Collection<T>>

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
