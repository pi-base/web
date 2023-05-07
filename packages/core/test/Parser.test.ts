import { expect, it } from 'vitest'
import { parser } from '../src/Parser'

function link([kind, id]: [unknown, unknown]) {
  return {
    href: `${kind}://${id}`,
    title: `${id}`,
  }
}

async function parse(input: string) {
  const file = await parser({
    link: {
      internal: link,
      external: link,
    },
  }).process(input)
  return String(file)
}

it('parses a citation', async () => {
  expect(await parse('{{doi:123}}')).toEqual(
    '<a href="doi://123" title="123" class="external-link">123</a>',
  )
})

it('parses an internal link', async () => {
  expect(await parse('{S123}')).toEqual(
    '<a href="S://123" title="123" class="internal-link">123</a>',
  )
})

it('parses a complex example', async () => {
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

  expect(await parse(example)).toMatchSnapshot()
})
