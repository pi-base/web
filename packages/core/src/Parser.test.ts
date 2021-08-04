import { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { tokenized, html, renderHTML } from './Parser'

function deposition(tree: Node) {
  visit(tree, (node) => delete node['position'])
  return tree
}

describe('tokenization', () => {
  function run(input: string) {
    const processor = tokenized()
    return deposition(processor.runSync(processor.parse(input)))
  }

  it('parses a citation', () => {
    expect(run('{{doi:123}}')).toEqual({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'citation',
              value: 'doi:123',
            },
          ],
        },
      ],
    })
  })

  it('parses an internal link', () => {
    expect(run('{S1}')).toEqual({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'internalLink',
              value: 'S1',
            },
          ],
        },
      ],
    })
  })

  it('parses math', () => {
    expect(run('$1 + 1 = 2$ and $$2 + 2 = 4$$')).toEqual({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'inlineMath',
              value: '1 + 1 = 2',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'blockMath',
              value: '2 + 2 = 4',
            },
          ],
        },
      ],
    })
  })
})

describe('html', () => {
  async function run(body: string) {
    return renderHTML(html(), body)
  }

  it('renders reference links', async () => {
    expect(await run('{S1} is described in {{mr:123}}')).toEqual(
      '<internalLink>S1</internalLink> is described in <citation>mr:123</citation>',
    )
  })

  it('renders a complex example', async () => {
    const example = `This is a list of links

* {S000123}
* {P000123}
* {T000123}
* {{doi:123}}
* {{mr:123}}
* {{wikipedia:123}}
* {{mathse:123}}
* {{mo:123}}`

    expect(await run(example)).toEqual(`<p>This is a list of links</p>
<ul>
<li><internalLink>S000123</internalLink></li>
<li><internalLink>P000123</internalLink></li>
<li><internalLink>T000123</internalLink></li>
<li><citation>doi:123</citation></li>
<li><citation>mr:123</citation></li>
<li><citation>wikipedia:123</citation></li>
<li><citation>mathse:123</citation></li>
<li><citation>mo:123</citation></li>
</ul>`)
  })

  it('renders a complex example with math', async () => {
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

    expect(await run(example)).toMatchSnapshot()
  })
})
