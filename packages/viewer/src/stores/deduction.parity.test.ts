import { readFileSync } from 'node:fs'
import { get, writable } from 'svelte/store'
import { describe, expect, it } from 'vitest'
import { artifacts, bundle as B } from '@pi-base/core'
import * as Gateway from '@/gateway'
import { Collection, Id, Theorems, Traits, type Trait } from '@/models'
import * as Deduction from './deduction'

// Precomputed artifacts must match what the client prover derives on the same
// data: users check published results by re-deriving them locally, and
// alternative data sources without artifacts fall back to client deduction.
describe('artifact deduction parity', () => {
  it('derives the same traits as the client prover', async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL('../../cypress/fixtures/main.min.json', import.meta.url),
        'utf-8',
      ),
    )
    const bundle = B.deserialize(fixture)

    // Artifact-side: deduce each space through core's pinned-order entry points
    const index = artifacts.implications(bundle)
    const fromArtifacts = new Map<string, boolean>()
    for (const space of bundle.spaces.values()) {
      const result = artifacts.deduceSpace(bundle, space.uid, index)
      expect(result.kind).toEqual('derivations')
      if (result.kind !== 'derivations') {
        continue
      }
      for (const { property, value } of result.derivations.all()) {
        fromArtifacts.set(`${Id.toInt(space.uid)}|${Id.toInt(property)}`, value)
      }
    }

    // Client-side: run the same bundle through the gateway transform and the
    // eager full-database deduction pass
    const synced = await Gateway.sync(unusedFetch, bundle)('host', 'branch')
    const properties = Collection.byId(synced!.properties)
    const spaces = writable(Collection.byId(synced!.spaces))
    const theorems = writable(Theorems.build(synced!.theorems, properties))
    const traits = writable(
      Traits.build(synced!.traits, get(spaces), properties),
    )

    const derived: Trait[] = []
    const store = Deduction.create(undefined, spaces, traits, theorems, added =>
      derived.push(...added),
    )
    await store.run()

    expect(get(store).contradiction).toBeUndefined()

    const fromClient = new Map(
      derived.map(({ space, property, value }) => [
        `${space}|${property}`,
        value,
      ]),
    )

    const mismatched = [...fromArtifacts].filter(
      ([key, value]) => fromClient.get(key) !== value,
    )
    expect(mismatched).toEqual([])
    expect(fromClient.size).toEqual(fromArtifacts.size)

    // Guard against vacuously passing on an empty or trivial fixture
    expect(fromArtifacts.size).toBeGreaterThan(100)
  })
})

const unusedFetch = async () => {
  throw new Error('parity test should not fetch')
}
