import { idToInt } from './util'

describe('idToInt', () => {
  it('handles standard ids', () => {
    expect(idToInt('S000123')).toEqual(123)
  })

  it('handles partial ids', () => {
    expect(idToInt('P234')).toEqual(234)
  })
})
