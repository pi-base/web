import { describe, expect, it } from 'vitest'
import * as artifacts from '../src/Artifacts'
import { Bundle, deserialize } from '../src/Bundle'
import { atom, or } from '../src/Formula'
import { Id } from '../src/Id'
import { Derivations } from '../src/Logic'
import { property, space, theorem, trait } from '../src/testUtils'

const version = { ref: 'test', sha: 'HEAD' }

const fixtures = {
  properties: [
    property({ uid: 'P1' }),
    property({ uid: 'P2' }),
    property({ uid: 'P3' }),
    property({ uid: 'P4' }),
  ],
  spaces: [space({ uid: 'S1' }), space({ uid: 'S2' })],
  theorems: [
    theorem({ uid: 'T1', when: atom('P1'), then: atom('P2') }),
    theorem({ uid: 'T2', when: atom('P2'), then: or(atom('P3'), atom('P4')) }),
  ],
  traits: [
    trait({ space: 'S1', property: 'P1', value: true }),
    trait({ space: 'S1', property: 'P3', value: false }),
    trait({ space: 'S2', property: 'P2', value: false }),
  ],
  version,
}

function deduceAll(bundle: Bundle): Map<Id, Derivations<Id, Id>> {
  const index = artifacts.implications(bundle)
  const deductions = new Map<Id, Derivations<Id, Id>>()

  for (const space of bundle.spaces.values()) {
    const result = artifacts.deduceSpace(bundle, space.uid, index)
    if (result.kind !== 'derivations') {
      throw new Error(`unexpected contradiction for space=${space.uid}`)
    }
    deductions.set(space.uid, result.derivations)
  }

  return deductions
}

function serializeAll(bundle: Bundle) {
  const { manifest, core, text, spaces } = artifacts.serialize(
    bundle,
    deduceAll(bundle),
  )
  return { manifest, core, text, spaces: [...spaces.entries()] }
}

describe('serialize', () => {
  const bundle = deserialize(fixtures)

  it('produces the expected manifest', () => {
    expect(artifacts.serialize(bundle, deduceAll(bundle)).manifest).toEqual({
      format: artifacts.FORMAT,
      version,
      paths: {
        core: 'core.json',
        text: 'text.json',
        spaces: 'spaces/{id}.json',
      },
    })
  })

  it('strips text from the core artifact', () => {
    const { core } = artifacts.serialize(bundle, deduceAll(bundle))

    expect(core.properties).toEqual([
      { uid: 'P1', name: 'P1', aliases: [], counterexamples_id: undefined },
      { uid: 'P2', name: 'P2', aliases: [], counterexamples_id: undefined },
      { uid: 'P3', name: 'P3', aliases: [], counterexamples_id: undefined },
      { uid: 'P4', name: 'P4', aliases: [], counterexamples_id: undefined },
    ])
    expect(core.traits).toEqual([
      { space: 'S1', property: 'P1', value: true },
      { space: 'S1', property: 'P3', value: false },
      { space: 'S2', property: 'P2', value: false },
    ])
    expect(core.theorems.map(t => t.uid)).toEqual(['T1', 'T2'])
  })

  it('keeps text in the text artifact', () => {
    const { text } = artifacts.serialize(bundle, deduceAll(bundle))

    expect(text.properties).toEqual([
      { uid: 'P1', description: 'P1', refs: [] },
      { uid: 'P2', description: 'P2', refs: [] },
      { uid: 'P3', description: 'P3', refs: [] },
      { uid: 'P4', description: 'P4', refs: [] },
    ])
    expect(text.traits).toEqual([
      { space: 'S1', property: 'P1', description: '', refs: [] },
      { space: 'S1', property: 'P3', description: '', refs: [] },
      { space: 'S2', property: 'P2', description: '', refs: [] },
    ])
  })

  it('shards derived traits and proofs per space', () => {
    const { spaces } = artifacts.serialize(bundle, deduceAll(bundle))

    expect(spaces.get('S1')).toEqual({
      space: 'S1',
      traits: [
        {
          property: 'P2',
          value: true,
          proof: { theorems: ['T1'], properties: ['P1'] },
        },
        {
          property: 'P4',
          value: true,
          proof: { theorems: ['T1', 'T2'], properties: ['P3', 'P1'] },
        },
      ],
      version,
    })
    expect(spaces.get('S2')).toEqual({
      space: 'S2',
      traits: [
        {
          property: 'P1',
          value: false,
          proof: { theorems: ['T1'], properties: ['P2'] },
        },
      ],
      version,
    })
  })

  it('is deterministic regardless of input order', () => {
    const shuffled = deserialize({
      ...fixtures,
      properties: [...fixtures.properties].reverse(),
      spaces: [...fixtures.spaces].reverse(),
      theorems: [...fixtures.theorems].reverse(),
      traits: [...fixtures.traits].reverse(),
    })

    expect(JSON.stringify(serializeAll(shuffled))).toEqual(
      JSON.stringify(serializeAll(bundle)),
    )
  })

  it('is deterministic across repeated runs', () => {
    expect(JSON.stringify(serializeAll(bundle))).toEqual(
      JSON.stringify(serializeAll(bundle)),
    )
  })
})
