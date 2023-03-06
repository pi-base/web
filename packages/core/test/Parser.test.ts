import { expect, it } from 'vitest'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'
import Parser from '../src/Parser'

function parse(input: string) {
  const parser = Parser()
  return parser.runSync(parser.parse(input))
}

it.skip('parses a citation', () => {
  const parsed = parse('{{doi:123}}')

  expect(deposition(parsed)).toEqual({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'citation',
            citation: 'doi:123',
            data: {
              hName: 'citation',
              hProperties: {
                citation: 'doi:123',
              },
            },
          },
        ],
      },
    ],
  })
})

it.skip('parses a complex example', () => {
  const example = `Inline math $2 + 2 = 4$ and display math $$2 + 2 = 4$$.

This is a list of links

* {S000123}
* {P000123}
* {T000123}
* {{doi:123}}
* {{mr:123}}
* {{wikipedia:123}}
* {{mathse:123}}
* {{mo:123}}`

  expect(parse(example)).toMatchSnapshot()
})

function deposition(tree: Node) {
  visit(tree, (node) => delete node['position'])
  return tree
}
