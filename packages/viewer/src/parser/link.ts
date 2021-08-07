import type { Node } from 'unist'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

export type Link = {
  href: string
  label: string
}

export type Linker = (contents: string) => Link | string | void

export type Linkers = { [key: string]: Linker }

type ExtendedNode = Node & {
  tagName: string
  properties: Record<string, unknown>
  children: { type: string; value: string }[] // FIXME: handle "given a node that doesn't match this shape" case
}

// TODO: push this down to @pi-base/core
export default function link(linkers: Linkers) {
  return function (): Transformer {
    return function transformer(tree: Node) {
      // FIXME: why is TS inferring an | type here?
      // eslint-disable-next-line
      visit<ExtendedNode, string>(
        tree as ExtendedNode,
        'element',
        (node: ExtendedNode | { type: string; value: string }) => {
          if (!('tagName' in node)) {
            return
          }

          const linker = linkers[node.tagName]
          if (!linker) {
            return
          }

          const contents: string = node.children[0].value
          const link = linker(contents)
          if (!link) {
            return
          } else if (typeof link === 'string') {
            node.tagName = 'code'
            node.properties = { to: contents }
            node.children = [{ type: 'text', value: link }]
          } else {
            const { href, label } = link

            node.tagName = 'a'
            node.properties = { href }
            node.children = [{ type: 'text', value: label }]
          }
        },
      )
    }
  }
}
