import { TestUtils } from '@pi-base/core'

import {
  type AssertedTrait,
  Collection,
  type Property,
  type SerializedTheorem,
  type Space,
  type Trait,
  Traits,
} from '../models'

export const and = TestUtils.and
export const atom = TestUtils.atom

type F<T, Required extends keyof T> = Partial<T> & Pick<T, Required>

export function property({ id, ...rest }: F<Property, 'id'>): Property {
  return {
    id,
    name: `Property ${id}`,
    aliases: [],
    description: '',
    refs: [],
    ...rest,
  }
}

export function space({ id, ...rest }: F<Space, 'id'>): Space {
  return {
    id,
    name: `Space ${id}`,
    aliases: [],
    description: '',
    refs: [],
    ...rest,
  }
}

export function theorem({
  id,
  when,
  then,
  ...rest
}: F<SerializedTheorem, 'id' | 'when' | 'then'>): SerializedTheorem {
  return {
    id,
    when,
    then,
    description: '',
    refs: [],
    ...rest,
  }
}

export function trait({
  space,
  property,
  ...rest
}: F<AssertedTrait, 'space' | 'property'>): AssertedTrait {
  return {
    asserted: true,
    space,
    property,
    value: true,
    description: '',
    refs: [],
    ...rest,
  }
}

export type TraitsArgs = Record<
  string, // space name
  Record<
    number, // property id
    boolean // trait value
  >
>

export function traits(args: TraitsArgs) {
  const spaces = new Set<Space>()
  const properties = new Set<Property>()
  const traits: Trait[] = []

  Object.entries(args).forEach(([name, map], i) => {
    const s = space({ id: i + 1, name })
    spaces.add(s)

    Object.entries(map).forEach(([pid, value]) => {
      const p = property({ id: parseInt(pid) })
      properties.add(p)

      traits.push(trait({ space: s.id, property: p.id, value }))
    })
  })

  const sc = Collection.byId([...spaces])
  const pc = Collection.byId([...properties])
  return {
    spaces: sc,
    properties: pc,
    traits: new Traits(traits, sc, pc),
  }
}
