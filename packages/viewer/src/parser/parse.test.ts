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
        '<a href="https://doi.org/123">DOI 123</a>',
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

      expect(math).toEqual('A $ B')
    })

    test('internal links', () =>
      expect(parse('C.f. {S123}')).resolves.toEqual(
        'C.f. <a href="/objects/S123">S123</a>',
      ))

    test('missing internal links', () =>
      expect(parse('C.f. {missing}')).resolves.toEqual(
        'C.f. <code to="missing">Could not find object</code>',
      ))
  })

  describe('truncated', () => {
    const parse = parser({ linkers })

    test('trims extra elements', () =>
      expect(parse('a list\n* one\n* two\n* three', true)).resolves.toEqual(
        'a list',
      ))
  })
})
