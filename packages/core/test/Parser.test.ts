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

it('parses a citation', () => {
  expect(parse('{{doi:123}}')).resolves.toEqual(
    '<a href="doi://123" title="123" class="external-link">123</a>',
  )
})

it('parses an internal link', () => {
  expect(parse('{S123}')).resolves.toEqual(
    '<a href="S://123" title="123" class="internal-link">123</a>',
  )
})

it('handles a bad separator', () => {
  expect(parse('{X123}')).resolves.toEqual('{X123}')
})

// TODO: for some reason when running this in the browser, this throws an
// uvu/Assertion error, but when running here, it just goes into a loop
it.todo('handles a missing id', () => {
  expect(parse('{S}')).resolves.toEqual('{S}')
})

it('handles an initial tag', () => {
  expect(parse('{')).resolves.toEqual('{')
})

it('handles an incomplete internal link', () => {
  expect(parse('{S123')).resolves.toEqual('{S123')
})

it('handles an incomplete external kind', () => {
  expect(parse('{{do')).resolves.toEqual('{{do')
})

it('handles an incomplete external id', () => {
  expect(parse('{{doi:123')).resolves.toEqual('{{doi:123')
})

it('parses a complex example', () => {
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

  expect(parse(example)).resolves.toMatchSnapshot()
})
