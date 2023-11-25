import { describe, expect, it } from 'vitest'
import { format, toInt, trim, tag } from '../src/Id'

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

  it('does not match nonexistent kinds', () => {
    expect(toInt('Z000100')).toEqual(0)
  })

  it('matches unknown kind', () => {
    expect(toInt('000123')).toEqual(123)
  })
})

describe('trim', () => {
  it('trims down to the numeric content', () => {
    expect(trim('T000100')).toEqual(100)
  })

  it('does not require leading zeros', () => {
    expect(trim('P12')).toEqual(12)
  })

  it('does not match nonexistent kinds', () => {
    expect(trim('Z000100')).toEqual(0)
  })

  it('matches unknown kind', () => {
    expect(trim('000123')).toEqual(123)
  })
})
