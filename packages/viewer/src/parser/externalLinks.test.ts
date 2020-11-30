import link from './externalLinks'

const providers = ['doi', 'mr', 'wikipedia', 'mathse', 'mo']

providers.forEach(provider => {
  it(`parses ${provider} links`, () => {
    expect(link({ citation: `${provider}:123` })).not.toBeUndefined()
  })
})

it('does not error on missing citations', () => {
  expect(link({ citation: undefined })).toBeUndefined()
})

it('does not error on unrecognized providers', () => {
  expect(link({ citation: 'example:123' })).toBeUndefined()
})
