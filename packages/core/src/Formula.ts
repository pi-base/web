import { z } from 'zod'
import { parse as _parse } from './Formula/Grammar.js'

import { union } from './Util.js'

type F<P> =
  | { kind: 'atom'; property: P; value: string }
  | { kind: 'or'; subs: F<P>[] }
  | { kind: 'and'; subs: F<P>[] }

function atomSchema<P>(p: z.ZodSchema<P>): z.ZodSchema<F<P>> {
  return z.object({
    kind: z.literal('atom'),
    property: p,
    value: z.enum(['any', 'unknown', 'true', 'false']),
  }) as any
}

const andSchema = <P>(p: z.ZodSchema<P>) =>
  z.object({
    kind: z.literal('and'),
    subs: z.array(z.lazy(() => formulaSchema(p))),
  })

const orSchema = <P>(p: z.ZodSchema<P>) =>
  z.object({
    kind: z.literal('or'),
    subs: z.array(z.lazy(() => formulaSchema(p))),
  })

export const formulaSchema = <P>(p: z.ZodSchema<P>): z.ZodSchema<F<P>> =>
  z.union([atomSchema(p), andSchema(p), orSchema(p)])

export interface Atom<P, X = never> {
  kind: 'atom'
  property: P
  value: 'any' | 'unknown' | 'true' | 'false' | X
}

export interface And<P, X = never> {
  kind: 'and'
  subs: Formula<P, X>[]
}

export interface Or<P, X = never> {
  kind: 'or'
  subs: Formula<P, X>[]
}

export type Formula<P, X = never> = And<P, X> | Or<P, X> | Atom<P, X>

export function and<P, X = never>(...subs: Formula<P, X>[]): And<P, X> {
  return { kind: 'and', subs: subs }
}

export function or<P, X = never>(...subs: Formula<P, X>[]): Or<P, X> {
  return { kind: 'or', subs: subs }
}

export function atom<P, X = never>(
  property: P,
  value: 'any' | 'unknown' | 'true' | 'false' | X = 'true',
): Atom<P, X> {
  return { kind: 'atom', property, value }
}

export function properties<P, X>(f: Formula<P, X>): Set<P> {
  switch (f.kind) {
    case 'atom':
      return new Set([f.property])
    default:
      return union(...f.subs.map(properties))
  }
}

export function render<T>(f: Formula<T>, term: (t: T) => string): string {
  switch (f.kind) {
    case 'atom':
      // eslint-disable-next-line no-case-declarations
      const name = term(f.property)
      return f.value ? name : '¬' + name
    case 'and':
      return '(' + f.subs.map(sf => render(sf, term)).join(' ∧ ') + ')'
    case 'or':
      return '(' + f.subs.map(sf => render(sf, term)).join(' ∨ ') + ')'
  }
}

export function negate<P>(formula: Formula<P>): Formula<P> {
  switch (formula.kind) {
    case 'atom':
      let newValue = formula.value
      if (formula.value === 'true') {
        newValue = 'false'
      }
      if (formula.value === 'false') {
        newValue = 'true'
      }
      return atom(formula.property, newValue)
    case 'and':
      return or(...formula.subs.map(negate))
    case 'or':
      return and(...formula.subs.map(negate))
  }
}

export function map<P, Q, X = never>(
  func: (p: Atom<P, X>) => Atom<Q, X>,
  formula: Formula<P, X>,
): Formula<Q, X> {
  switch (formula.kind) {
    case 'atom':
      return func(formula)
    default:
      return {
        ...formula,
        subs: formula.subs.map(sub => map(func, sub)),
      }
  }
}

export function mapProperty<P, Q, X = never>(
  func: (p: P) => Q,
  formula: Formula<P, X>,
): Formula<Q, X> {
  function mapAtom(a: Atom<P, X>): Atom<Q, X> {
    return { ...a, property: func(a.property) }
  }
  return map<P, Q, X>(mapAtom, formula)
}

export function compact<P, X>(
  f: Formula<P | undefined, X>,
): Formula<P, X> | undefined {
  return properties(f).has(undefined) ? undefined : (f as Formula<P, X>)
}

export function evaluate<T, V extends boolean | null = boolean>(
  f: Formula<T, V>,
  traits: Map<T, boolean>,
): boolean | undefined {
  let result: boolean | undefined

  switch (f.kind) {
    case 'atom':
      const known = traits.has(f.property)
      if (f.value === null) {
        return !known
      }
      if (!known) {
        return undefined
      }
      return traits.get(f.property) === f.value
    case 'and':
      result = true // by default
      f.subs.forEach(sub => {
        if (result === false) {
          return
        }
        const sv = evaluate(sub, traits)
        if (sv === false) {
          // definitely false
          result = false
        } else if (result && sv === undefined) {
          // maybe false
          result = undefined
        }
      })
      return result
    case 'or':
      result = false
      f.subs.forEach(sub => {
        if (result === true) {
          return
        }
        const sv = evaluate(sub, traits)
        if (sv === true) {
          // definitely true
          result = true
        } else if (result === false && sv === undefined) {
          // maybe true
          result = undefined
        }
      })
      return result
  }
}

export function parse(q?: string): Formula<string, null> | undefined {
  if (!q) {
    return
  }

  let parsed
  try {
    // eslint-disable-next-line
    parsed = _parse(q)
  } catch {
    if (q && q.startsWith('(')) {
      return
    } else {
      return parse('(' + q + ')')
    }
  }

  return fromJSON(parsed as any)
}

type Serialized<X = never> =
  | { and: Serialized[] }
  | { or: Serialized[] }
  | { property: string; value: boolean | X }
  | Record<string, boolean | X>

export function fromJSON(json: Serialized): Formula<string, null> {
  if ('and' in json && typeof json.and === 'object') {
    return and<string, null>(...json.and.map(fromJSON))
  } else if ('or' in json && typeof json.or === 'object') {
    return or<string, null>(...json.or.map(fromJSON))
  } else if ('property' in json && typeof json.property === 'string') {
    return atom<string, null>(json.property, json.value ? 'true' : 'false')
  }

  const entries = Object.entries(json)
  if (entries.length !== 1) {
    throw `cannot cast object with ${entries.length} keys to atom`
  }

  if (typeof entries[0][1] !== 'boolean') {
    throw `cannot cast object with non-boolean value`
  }

  return atom<string, null>(...entries[0])
}

export function toJSON(f: Formula<string>): Serialized {
  switch (f.kind) {
    case 'atom':
      return { [f.property]: f.value === 'true' }
    case 'and':
      return { and: f.subs.map(toJSON) }
    case 'or':
      return { or: f.subs.map(toJSON) }
  }
}
