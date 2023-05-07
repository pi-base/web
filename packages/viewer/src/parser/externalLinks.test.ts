import { expect, it } from 'vitest'
import { external } from './externalLinks'

const providers = ['doi', 'mr', 'wikipedia', 'mathse', 'mo'] as const

providers.forEach(provider => {
  it(`parses ${provider} links`, () => {
    expect(external([provider, '123'])).not.toBeUndefined()
  })
})
