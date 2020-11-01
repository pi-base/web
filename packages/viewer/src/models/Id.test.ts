import Id from './Id'

describe('toInt', () => {
  it('handles standard ids', () => {
    expect(Id.toInt('S000123')).toEqual(123)
  })

  it('handles partial ids', () => {
    expect(Id.toInt('P234')).toEqual(234)
  })
})
