import remark from 'remark'
import type unified from 'unified'
import type unist from 'unist'
import visit from 'unist-util-visit'

function delimitedParser(type: string, start: string, stop: string) {
  function parser(
    eat: (tag: string) => (token: Record<string, unknown>) => void,
    value: string,
    silent: boolean,
  ) {
    if (!value.startsWith(start)) {
      return
    }

    const stopPosition = value.indexOf(stop, start.length)
    if (stopPosition === -1) {
      return
    }

    if (silent) {
      return true
    }

    const tag = value.slice(0, stopPosition + stop.length)
    const inner = tag.slice(start.length, stopPosition)

    return eat(tag)({ type, [type]: inner })
  }

  parser.locator = (value: string, from: number) => value.indexOf(start, from)

  return parser
}

export function tokenize(this: unified.Processor): unified.Transformer {
  const parser = this.Parser.prototype

  parser.inlineTokenizers.citation = delimitedParser('citation', '{{', '}}')
  parser.inlineTokenizers.internalLink = delimitedParser(
    'internalLink',
    '{',
    '}',
  )
  parser.inlineTokenizers.blockMathDollars = delimitedParser(
    'blockMath',
    '$$',
    '$$',
  )
  parser.inlineTokenizers.blockMathParens = delimitedParser(
    'blockMath',
    '\\[',
    '\\]',
  )
  parser.inlineTokenizers.inlineMathDollars = delimitedParser(
    'inlineMath',
    '$',
    '$',
  )
  parser.inlineTokenizers.inlineMathParens = delimitedParser(
    'inlineMath',
    '\\(',
    '\\)',
  )

  // It is important that the \(...\) tokenizer appears before the escape tokenizer
  //   but we might want to defer the others to later in the chain
  parser.inlineMethods.splice(
    parser.inlineMethods.indexOf('escape'),
    0,
    'citation',
    'internalLink',
    'blockMathDollars',
    'blockMathParens',
    'inlineMathDollars',
    'inlineMathParens',
  )

  return function transformer(tree: unist.Node) {
    visit(tree, 'citation', (node) => {
      node.data = {
        hName: 'citation',
        hProperties: {
          citation: node.citation,
        },
      }
    })

    visit(tree, 'blockMath', (node) => {
      node.data = {
        hName: 'span',
        hProperties: {
          className: ['math-display'],
        },
        hChildren: [{ type: 'text', value: node.blockMath }],
      }
    })

    visit(tree, 'inlineMath', (node) => {
      node.data = {
        hName: 'span',
        hProperties: {
          className: ['math-inline'],
        },
        hChildren: [{ type: 'text', value: node.inlineMath }],
      }
    })

    visit(tree, 'internalLink', (node) => {
      node.data = {
        hName: 'internalLink',
        hProperties: {
          to: node.internalLink,
        },
      }
    })
  }
}

export default function Parser(): unified.Processor {
  return remark().use(tokenize)
}
