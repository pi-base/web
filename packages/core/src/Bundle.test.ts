import Bundle from './Bundle'

describe('Bundle', () => {
  const version = {
    ref: 'test',
    sha: 'test'
  }

  test('it builds with empty input', () => {
    new Bundle(
      [],
      [],
      [],
      [],
      version
    )
  })
})
