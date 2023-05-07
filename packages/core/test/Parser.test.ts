import { expect, it } from 'vitest'
import { parser } from '../src/Parser'

async function parse(input: string) {
  const file = await parser().process(input)
  return String(file)
}

it('parses a citation', async () => {
  expect(await parse('{{doi:123}}')).toEqual(
    '<external-link kind="doi" id="123"></external-link>',
  )
})

it('parses an internal link', async () => {
  expect(await parse('{S123}')).toEqual(
    '<internal-link kind="space" id="123"></internal-link>',
  )
})

it('parses an internal link', async () => {
  expect(await parse('{S123}')).toEqual(
    '<internal-link kind="space" id="123"></internal-link>',
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
