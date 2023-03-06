import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { Processor, Transformer } from 'unified'
import { Node } from 'unist'

type HData = {
  hName: string
  hProperties: Record<string, unknown>
  hChildren?: { type: string, value: unknown }[]
}

export function tokenize(this: Processor): Transformer {
  return function transformer(tree: Node) {
    function visits(field: string, buildData: (v: unknown) => HData) {
      visit(tree, field, (node: Node) => {
        const value: unknown = (node as any)[field]
        node.data = buildData(value)
      })
    }

    visits('citation', (citation) => ({
      hName: 'citation',
      hProperties: { citation }
    }))

    visits('blockMath', (value) => ({
      hName: 'span',
      hProperties: {
        className: ['math-display'],
      },
      hChildren: [{ type: 'text', value }],
    }))

    visits('inlineMath', (value) => ({
      hName: 'span',
      hProperties: {
        className: ['math-inline'],
      },
      hChildren: [{ type: 'text', value }],
    }))

    visits('internalLink', (to) => ({
      hName: 'internalLink',
      hProperties: {
        to,
      },
    }))
  }
}

export default function Parser(): Processor {
  return remark().use(tokenize)
}
