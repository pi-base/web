import {
  Id,
  Property,
  Space,
  Theorem,
  Trait,
  bundle as b,
  formula as f,
  TestUtils as F,
} from '@pi-base/core'

import * as V from './validations'

describe('bundle', () => {
  function bundle({
    properties = [],
    spaces = [],
    theorems = [],
    traits = [],
    version = {
      ref: 'test',
      sha: 'HEAD',
    },
  }: {
    properties?: Property[]
    spaces?: Space[]
    traits?: Trait[]
    theorems?: Theorem[]
    version?: { ref: string; sha: string }
  }) {
    return V.bundle(
      b.deserialize({ properties, spaces, theorems, traits, version }),
    )
  }

  it('can validate without error', () => {
    const { errors } = bundle({
      properties: [F.property({ uid: 'P1' }), F.property({ uid: 'P2' })],
      spaces: [F.space({ uid: 'S1' })],
      theorems: [
        F.theorem({
          uid: 'T1',
          when: f.atom('P1'),
          then: f.atom('P2'),
        }),
      ],
      traits: [
        F.trait({
          property: 'P1',
          space: 'S1',
        }),
      ],
    })

    expect(errors).toEqual([])
  })

  it('checks trait references', () => {
    const { errors } = bundle({
      traits: [
        F.trait({
          property: 'P1',
          space: 'S1',
        }),
      ],
    })

    expect(errors).toHaveLength(2)
  })

  it('checks theorem references', () => {
    const { errors } = bundle({
      properties: [F.property({ uid: 'P1' })],
      spaces: [F.space({ uid: 'S1' })],
      theorems: [
        F.theorem({
          uid: 'T1',
          when: f.atom('P1'),
          then: f.atom('P2'),
        }),
      ],
      traits: [
        F.trait({
          property: 'P1',
          space: 'S1',
        }),
      ],
    })

    expect(errors).toEqual([
      {
        path: 'theorems/T1.md',
        message: 'then references unknown property=P2',
      },
    ])
  })

  it('checks for counterexamples', () => {
    const { errors } = bundle({
      properties: [F.property({ uid: 'P1' }), F.property({ uid: 'P2' })],
      spaces: [F.space({ uid: 'S1' })],
      theorems: [
        F.theorem({
          uid: 'T1',
          when: f.atom('P1'),
          then: f.atom('P2'),
        }),
      ],
      traits: [
        F.trait({
          property: 'P1',
          space: 'S1',
        }),
        F.trait({
          property: 'P2',
          space: 'S1',
          value: false,
        }),
      ],
    })

    expect(errors).toEqual([
      {
        path: 'spaces/S1/README.md',
        message: 'properties=P1,P2 contradict theorems=T1',
      },
    ])
  })

  it('adds deductions', () => {
    const { value: b, errors } = bundle({
      properties: [
        F.property({ uid: 'P1' }),
        F.property({ uid: 'P2' }),
        F.property({ uid: 'P3' }),
      ],
      spaces: [F.space({ uid: 'S1' })],
      theorems: [
        F.theorem({
          uid: 'T1',
          when: f.atom('P1'),
          then: f.atom('P2'),
        }),
        F.theorem({
          uid: 'T2',
          when: f.atom('P2'),
          then: f.atom('P3'),
        }),
      ],
      traits: [
        F.trait({
          property: 'P1',
          space: 'S1',
        }),
      ],
    })

    expect(errors).toEqual([])

    const { value, proof } = b!.traits.get(
      Id.traitId({ space: 'S1', property: 'P3' }),
    )!

    expect(value).toEqual(true)
    expect(proof).toEqual({
      properties: ['P1'],
      theorems: ['T1', 'T2'],
    })
  })
})
