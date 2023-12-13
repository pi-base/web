import { describe, expect, it } from 'vitest'
import { format, normalize, toInt, trim, tag } from '../src/Id'

describe('format', () => {
  it('pads the given character', () => {
    expect(format('A', 1)).toEqual('A000001')
  })

  it('does not pad unless needed', () => {
    expect(format('Z', 123456)).toEqual('Z123456')
  })
})

describe('toInt', () => {
  it('trims down to the numeric content', () => {
    expect(toInt('T000100')).toEqual(100)
  })

  it('does not require leading zeros', () => {
    expect(toInt('P12')).toEqual(12)
  })

  it('handles non-existent kinds', () => {
    expect(toInt('Z000100')).toEqual(100)
  })

  it('matches unknown kind', () => {
    expect(toInt('000123')).toEqual(123)
  })
})

describe('normalize', () => {
  it('pads', () => {
    expect(normalize('T100')).toEqual('T000100')
  })

  it('capitalizes', () => {
    expect(normalize('s10')).toEqual('S000010')
  })

  it('handles leading zeros', () => {
    expect(normalize('P012')).toEqual('P000012')
  })

  it('nulls nonexistent kinds', () => {
    expect(normalize('Z00100')).toEqual(null)
  })

  it('trims file suffixes', () => {
    expect(normalize('S000123.md')).toEqual('S000123')
  })
})

describe('trim', () => {
  it('trims down to the numeric content', () => {
    expect(trim('T000100')).toEqual('100')
  })

  it('does not require leading zeros', () => {
    expect(trim('P12')).toEqual('12')
  })

  it('handles nonexistent kinds', () => {
    expect(trim('Z000100')).toEqual('100')
  })

  it('matches unknown kind', () => {
    expect(trim('000123')).toEqual('123')
  })
})

describe('tag', () => {
  it('tags spaces', () => {
    expect(tag('S000100')?.kind).toEqual('space')
  })

  it('tags properties', () => {
    expect(tag('P000100')?.kind).toEqual('property')
  })

  it('tags theorems', () => {
    expect(tag('T000100')?.kind).toEqual('theorem')
  })

  it('is null if missing a kind', () => {
    expect(tag('000100')).toEqual(null)
  })

  it('is null for nonexistent kinds', () => {
    expect(tag('X000100')).toEqual(null)
  })

  it('allows lowercase', () => {
    expect(tag('s000100')?.kind).toEqual('space')
  })
})
