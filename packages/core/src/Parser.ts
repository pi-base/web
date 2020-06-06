/// <reference path="Parser.d.ts" />
import remark from 'remark'
import remark2rehype from 'remark-rehype'
import visit from 'unist-util-visit'

// Adapted from
// * https://github.com/djm/remark-shortcodes/blob/master/index.js
// * https://using-remark.gatsbyjs.org/custom-components/
const delimitedParser = (type: string, start: string, stop: string) => {
  function parser(eat: Function, value: string, silent: boolean) {
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

    return eat(tag)({type, [type]: inner})
  }

  parser.locator = (value: string, from: number) => value.indexOf(start, from)

  return parser
}

function pibase(this: any) {
  const parser = this.Parser.prototype

  parser.inlineTokenizers.citation = delimitedParser('citation', '{{', '}}')
  parser.inlineTokenizers.inlineMathDollars = delimitedParser(
    'inlineMath',
    '$',
    '$'
  )
  parser.inlineTokenizers.inlineMathParens = delimitedParser(
    'inlineMath',
    '\\(',
    '\\)'
  )

  // It is important that the \(...\) tokenizer appears before the escape tokenizer
  //   but we might want to defer the others to later in the chain
  parser.inlineMethods.splice(
    parser.inlineMethods.indexOf('escape'),
    0,
    'citation',
    'inlineMathDollars',
    'inlineMathParens'
  )

  const transformer = (tree: any) => {
    visit(tree, 'citation', node => {
      node.data = {
        hName: 'citation',
        hProperties: {
          citation: node.citation
        }
      }
    })
    visit(tree, 'inlineMath', node => {
      node.data = {
        hName: 'inlineMath',
        hProperties: {
          inline: true,
          formula: node.inlineMath
        }
      }
    })
  }

  return transformer
}

export default () =>
  remark()
    .use(pibase)
    .use(remark2rehype)
