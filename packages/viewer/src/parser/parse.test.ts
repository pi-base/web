import { parser } from './parse'
import citation from './externalLinks'

function internalLink({ to }: { to?: string }) {
  if (!to) {
    return
  }
  if (to === 'missing') {
    return 'Could not find object'
  }

  return { href: `/objects/${to}`, label: to }
}

describe('parse', () => {
  const linkers = {
    citation,
    internalLink,
  }

  describe('untruncated', () => {
    const parse = parser({ linkers })

    test('doi links', () =>
      expect(parse('{{doi:123}}')).resolves.toEqual(
        '<p><a href="https://doi.org/123">DOI 123</a></p>',
      ))

    test('block math', async () => {
      const math = await parse('Thus $$2 + 2 = 4$$.')

      expect(math).toContain('Thus <span class="math-display">')
      expect(math).toMatchSnapshot()
    })

    test('inline math', async () => {
      const math = await parse('Thus $2 + 2 = 4$.')

      expect(math).toContain('Thus <span class="math-inline">')
      expect(math).toMatchSnapshot()
    })

    test('unmatched', async () => {
      const math = await parse('A $ B')

      expect(math).toEqual('<p>A $ B</p>')
    })

    test('internal links', () =>
      expect(parse('C.f. {S123}')).resolves.toEqual(
        '<p>C.f. <a href="/objects/S123">S123</a></p>',
      ))

    test('missing internal links', () =>
      expect(parse('C.f. {missing}')).resolves.toEqual(
        '<p>C.f. <code to="missing">Could not find object</code></p>',
      ))
  })

  describe('truncated', () => {
    const parse = parser({ linkers, truncate: true })

    test('trims extra elements', () =>
      expect(parse('a list\n* one\n* two\n* three')).resolves.toEqual(
        '<p>a list</p>',
      ))
  })
})
