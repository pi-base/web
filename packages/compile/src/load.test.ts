import path from 'path'
import theredoc from 'theredoc'

import load, { rootDirectories, validate } from './load'

const repo = path.join(__dirname, '__tests__', 'repo')

describe('load', () => {
  it('builds a bundle', async () => {
    const { bundle, errors } = await load(path.join(repo, 'valid'))

    expect(errors).toBeUndefined()
    expect(bundle!.properties.size).toEqual(3)
    expect(bundle!.spaces.size).toEqual(2)
    expect(bundle!.theorems.size).toEqual(1)
    expect(bundle!.traits.size).toEqual(3)
    expect(bundle!.version.ref).not.toBeUndefined()
  })

  it('validates', async () => {
    const { errors = new Map() } = await load(path.join(repo, 'invalid'))

    expect(errors.get('theorems/T000001.md')).toContain(
      'if references unknown property=P100016'
    )
  })
})

describe('rootDirectories', () => {
  it('produces a list', () => {
    expect(rootDirectories(__dirname).length).toBeGreaterThanOrEqual(3)
  })
})

describe('validate', () => {
  const version = { ref: 'test', sha: 'HEAD' }

  it('handles property validation failures', () => {
    const { errors } = validate({
      properties: [{
        path: 'properties/1.md',
        contents: theredoc`
          ---
          uid: 1
          ---
          description
        `
      }],
      version
    })

    expect(errors).toEqual(new Map([
      ['properties/1.md', ['name is required']]
    ]))
  })

  it('handles theorem reference errors', () => {
    const { errors } = validate({
      properties: [{
        path: 'properties/P1.md',
        contents: theredoc`
          ---
          uid: P1
          name: P1
          ---
          Trivially.
        `
      }],
      theorems: [{
        path: 'theorems/T1.md',
        contents: theredoc`
          ---
          uid: T1
          if:
            P1: true
          then:
            P2: true
          ---
          Trivially.
        `
      }],
      version
    })

    expect(errors).toEqual(new Map([
      ['theorems/T1.md', ['then references unknown property=P2']]
    ]))
  })

  it('handles trait reference errors', () => {
    const { errors } = validate({
      traits: [{
        path: 'spaces/S1/properties/P1.md',
        contents: theredoc`
          ---
          space: S1
          property: P1
          ---
          Trivially.
        `
      }],
      version
    })

    expect(errors).toEqual(new Map([
      ['spaces/S1/properties/P1.md', ['unknown property=P1', 'unknown space=S1']]
    ]))
  })
})
