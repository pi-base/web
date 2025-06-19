import { describe, expect, it } from 'vitest'
import { writable, get } from 'svelte/store'
import {
  Collection,
  Theorem,
  Theorems,
  Traits,
  type Property,
  type Space,
  type Trait,
} from '@/models'
import * as Deduction from './deduction'
import {
  and,
  atom,
  property,
  space,
  theorem,
  trait,
} from '@/__test__/factories'
import type { Formula, SerializedTheorem } from '@pi-base/core'

type SetupParams = {
  initial?: Deduction.State
  spaces?: Space[]
  properties?: Property[]
  theorems?: SerializedTheorem[]
  traits?: Trait[]
}

describe(Deduction.create, () => {
  let addedTraits: Trait[] = []

  function addTraits(traits: Trait[]) {
    addedTraits.push(...traits)
  }

  function setup(args: Partial<SetupParams> = {}) {
    addedTraits = []

    const spaces = writable(Collection.byId(args.spaces || []))
    const properties = Collection.byId(args.properties || [])
    const theorems = writable(Theorems.build(args.theorems || [], properties))
    const traits = writable(
      Traits.build(args.traits || [], get(spaces), properties),
    )

    return Deduction.create(args.initial, spaces, traits, theorems, addTraits)
  }

  it('should initialize with spaces if no initial state provided', () => {
    const store = setup({
      spaces: [space({ id: 1 }), space({ id: 2 })],
    })
    const state = get(store)

    expect(state.all).toEqual(new Set([1, 2]))
    expect(state.checked).toEqual(new Set())
  })

  it('should run deductions and add new traits', async () => {
    const store = setup({
      spaces: [space({ id: 1 }), space({ id: 2 })],
      properties: [
        property({ id: 1 }),
        property({ id: 2 }),
        property({ id: 3 }),
      ],
      traits: [
        trait({
          space: 1,
          property: 1,
          value: true,
        }),
        trait({
          space: 2,
          property: 3,
          value: false,
        }),
      ],
      theorems: [
        theorem({
          id: 1,
          when: { kind: 'atom', property: 1, value: true },
          then: { kind: 'atom', property: 2, value: true },
        }),
        theorem({
          id: 2,
          when: { kind: 'atom', property: 2, value: true },
          then: { kind: 'atom', property: 3, value: true },
        }),
      ],
    })

    const stores: Deduction.State[] = []
    store.subscribe($store => stores.push($store))

    await store.run()

    // FIXME: this documents the current behavior, but it's surprising that we're
    // getting duplicated entries.
    expect(stores.map(({ checking, checked }) => [checking, checked])).toEqual([
      [undefined, new Set()],
      [undefined, new Set()],
      ['Space 1', new Set()],
      ['Space 1', new Set([1])],
      ['Space 1', new Set([1])],
      ['Space 2', new Set([1])],
      ['Space 2', new Set([1, 2])],
      ['Space 2', new Set([1, 2])],
      ['Space 2', new Set([1, 2])],
    ])

    expect(
      addedTraits.map(({ space, property, value }) => [space, property, value]),
    ).toEqual([
      [1, 2, true],
      [1, 3, true],
      [2, 2, false],
      [2, 1, false],
      [2, 2, false],
      [2, 1, false],
    ])
  })

  it('should mark spaces as checked after deduction', async () => {
    const store = setup({
      spaces: [space({ id: 1 })],
      properties: [property({ id: 1 })],
      traits: [
        trait({
          space: 1,
          property: 1,
          value: true,
        }),
      ],
    })

    await store.checked(1)

    const state = get(store)
    expect(state.checked).toContain(1)
  })

  it('should handle contradictions', async () => {
    // Create a setup that will lead to contradiction
    const store = setup({
      spaces: [space({ id: 1 })],
      properties: [property({ id: 1 }), property({ id: 2 })],
      traits: [
        trait({
          space: 1,
          property: 1,
          value: true,
        }),
        trait({
          space: 1,
          property: 2,
          value: false,
        }),
      ],
      theorems: [
        theorem({
          id: 1,
          when: { kind: 'atom', property: 1, value: true },
          then: { kind: 'atom', property: 2, value: true },
        }),
      ],
    })

    await store.checked(1)

    const state = get(store)
    expect(state.contradiction?.theorems).toContain(1)
  })

  it('should reset state when run with reset=true', async () => {
    const store = setup({
      spaces: [space({ id: 1 }), space({ id: 2 })],
      initial: {
        checked: new Set([3]),
        all: new Set([1, 2, 3]),
      },
    })

    await store.run(true)

    const state = get(store)
    expect(state.checked).toEqual(new Set([1, 2]))
    expect(state.all).toEqual(new Set([1, 2]))
  })

  it('should prove theorems correctly', () => {
    const store = setup({
      properties: [
        property({ id: 1 }),
        property({ id: 2 }),
        property({ id: 3 }),
      ],
      theorems: [
        theorem({
          id: 1,
          when: { kind: 'atom', property: 1, value: true },
          then: { kind: 'atom', property: 2, value: true },
        }),
        theorem({
          id: 2,
          when: { kind: 'atom', property: 2, value: true },
          then: { kind: 'atom', property: 3, value: false },
        }),
      ],
    })

    const proof = store.prove({
      when: {
        kind: 'atom',
        property: property({ id: 1 }),
        value: true,
      },
      then: {
        kind: 'atom',
        property: property({ id: 3 }),
        value: false,
      },
    } as any)

    expect((proof as Theorem[]).map(t => t.id)).toEqual([1, 2])
  })

  it('should handle multiple spaces in deduction', async () => {
    const store = setup({
      spaces: [space({ id: 1 }), space({ id: 2 })],
      properties: [property({ id: 1 })],
      traits: [
        trait({
          space: 1,
          property: 1,
          value: true,
        }),
        trait({
          space: 2,
          property: 1,
          value: false,
        }),
      ],
    })

    await store.run()

    expect(get(store).checked).toEqual(new Set([1, 2]))
  })

  it('should update all spaces set when new spaces are added', () => {
    const spacesStore = writable(Collection.byId([space({ id: 1 })]))

    const store = Deduction.create(
      undefined,
      spacesStore,
      writable(Traits.empty()),
      writable(new Theorems()),
      addTraits,
    )

    // Add a new space
    spacesStore.set(Collection.byId([space({ id: 1 }), space({ id: 2 })]))
    store.run()

    const state = get(store)
    expect(state.all).toContain(1)
    expect(state.all).toContain(2)
  })

  describe('disprove function', () => {
    it('should disprove a formula using theorems', () => {
      const t1 = theorem({
        id: 1,
        when: { kind: 'atom', property: 1, value: true },
        then: { kind: 'atom', property: 2, value: true },
      })

      const properties = Collection.byId([
        property({ id: 1 }),
        property({ id: 2 }),
      ])

      const theoremsStore = writable(Theorems.build([t1], properties))

      const formula: Formula<Property> = and(
        atom(property({ id: 1 }), true),
        atom(property({ id: 2 }), false),
      )

      expect(
        (Deduction.disprove(theoremsStore, formula) as Theorem[]).map(
          t => t.id,
        ),
      ).toEqual([1])
    })
  })
})
