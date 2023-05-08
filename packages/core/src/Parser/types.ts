import { TaggedRef } from '../Ref'

type InternalKind = 'S' | 'P' | 'T'
type ExternalKind = TaggedRef['kind']

type Link = { href: string; title: string }
type Linker<T> = (id: T) => Link

type Ids = {
  internal: [InternalKind, string]
  external: [ExternalKind, string]
}

export type Linkers = { [K in keyof Ids]: Linker<Ids[K]> }

export type InternalLinkNode = {
  type: 'internalLink'
  kind: InternalKind
  id: string
}

export type ExternalLinkNode = {
  type: 'externalLink'
  kind: ExternalKind
  id: string
}
