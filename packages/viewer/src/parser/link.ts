import type { Node } from 'unist'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'

export type Link = {
  href: string
  label: string
}

export type Linker = (
  properties: Record<string, unknown>,
) => Link | string | void

export type Linkers = { [key: string]: Linker }

type ExtendedNode = Node & {
  tagName: string
  properties: Record<string, unknown>
  children: unknown[]
}

export default function link(linkers: Linkers) {
  return function (): Transformer {
    return function transformer(tree: Node) {
      return visit<ExtendedNode>(tree, 'element', (node: ExtendedNode) => {
        const linker = linkers[node.tagName]
        if (!linker) {
          return
        }

        const link = linker(node.properties)
        if (!link) {
          return
        } else if (typeof link === 'string') {
          node.tagName = 'code'

          node.children = [{ type: 'text', value: link }]
        } else {
          const { href, label } = link

          node.tagName = 'a'
          node.properties = { href }
          node.children = [{ type: 'text', value: label }]
        }
      })
    }
  }
}
