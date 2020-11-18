import type { Property, Space, Theorem } from '../models'
import { parser, externalLinks, internalLinks } from '../parser'
import type { Finder } from '../parser/internalLinks'

export type Typesetter = (body: string, truncated?: boolean) => Promise<string>
export type Builder = (
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
) => Typesetter

export const typesetter: Builder = function build(
  properties: Finder<Property>,
  spaces: Finder<Space>,
  theorems: Finder<Theorem>,
): Typesetter {
  return parser({
    linkers: {
      citation: externalLinks,
      internalLink: internalLinks(properties, spaces, theorems),
    },
  })
}
