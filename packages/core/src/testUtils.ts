import { Formula, Property, Space, Theorem, Trait } from './index'

export function property({ uid, ...opts }: { uid: string } & Partial<Property>): Property {
  return {
    uid,
    counterexamples_id: undefined,
    name: uid,
    description: uid,
    aliases: [],
    refs: [],
    ...opts
  }
}

export function space({ uid, ...opts }: { uid: string } & Partial<Space>): Space {
  return {
    uid,
    counterexamples_id: undefined,
    name: uid,
    description: uid,
    aliases: [],
    refs: [],
    ambiguous_construction: false,
    ...opts
  }
}

export function trait({ value = true, ...opts }: { property: string, space: string } & Partial<Trait>): Trait {
  return {
    uid: '',
    counterexamples_id: undefined,
    description: '',
    refs: [],
    value,
    ...opts
  }
}

export function theorem({ uid, when, then, ...opts }: {
  uid: string
  when: Formula<string>
  then: Formula<string>
} & Partial<Theorem>): Theorem {
  return {
    uid,
    counterexamples_id: undefined,
    description: uid,
    refs: [],
    when,
    then,
    ...opts
  }
}
