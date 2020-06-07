import { replaceEnd } from './util'

describe('replaceEnd', () => {
  it('returns the original string if not found', () => {
    expect(
      replaceEnd('foo', 'bar', 'baz')
    ).toEqual('foo')
  })

  it('only returns the last occurrence', () => {
    expect(
      replaceEnd('bar foo bar quux', 'bar', 'baz')
    ).toEqual('bar foo baz')
  })
})