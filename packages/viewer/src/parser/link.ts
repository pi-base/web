import type { Node } from 'unist'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

export type Link = {
  href: string
  label: string
}

export type Linker = (
  properties: Record<string, unknown>,
) => Link | string | void

export type Linkers = { [key: string]: Linker }

export default function link(linkers: Linkers) {
  return function (): Transformer {
    return function transformer(tree: Node) {
      return visit(tree, 'element', (node: Node) => {
        // FIXME:
        // const linker = linkers[node.tagName as string]
        // if (!linker) {
        //   return
        // }
        // const link = linker(node.properties as Record<string, unknown>)
        // if (!link) {
        //   return
        // } else if (typeof link === 'string') {
        //   node.tagName = 'code'
        //   node.children = [{ type: 'text', value: link }]
        // } else {
        //   const { href, label } = link
        //   node.tagName = 'a'
        //   node.properties = { href }
        //   node.children = [{ type: 'text', value: label }]
        // }
      })
    }
  }
}
