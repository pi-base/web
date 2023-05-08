import { Transformer } from 'unified'
import { Root } from 'hast'
import { visit } from 'unist-util-visit'
import { ExternalLinkNode, InternalLinkNode, Linkers } from './types'

/**
 * Builds an MDAST transformer that enriches parsed internal and external link
 * nodes used provided link builders, and adds metadata to the MDAST so that
 * they will convert correctly to HAST.
 *
 * See https://github.com/syntax-tree/mdast-util-to-hast#fields-on-nodes
 */
export function references({ internal, external }: Linkers) {
  return (): Transformer<Root, Root> => {
    return function transformer(tree: Root) {
      visit(tree, 'internalLink', (node: InternalLinkNode) => {
        const { kind, id } = node

        const { href, title } = internal([kind, id])

        Object.assign(node, {
          data: {
            hName: 'a',
            hProperties: {
              href,
              title,
              className: 'internal-link',
            },
            hChildren: [
              {
                type: 'text',
                value: title,
              },
            ],
          },
        })
      })

      visit(tree, 'externalLink', (node: ExternalLinkNode) => {
        const { href, title } = external([node.kind, node.id])

        Object.assign(node, {
          data: {
            hName: 'a',
            hProperties: {
              href,
              title,
              className: 'external-link',
            },
            hChildren: [
              {
                type: 'text',
                value: title,
              },
            ],
          },
        })
      })
    }
  }
}
