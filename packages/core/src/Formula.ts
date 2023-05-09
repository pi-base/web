import { z } from 'zod'
import { parse as _parse } from './Formula/Grammar.js'

import { union } from './Util.js'

type F<P> =
  | { kind: 'atom'; property: P; value: boolean }
  | { kind: 'or'; subs: F<P>[] }
  | { kind: 'and'; subs: F<P>[] }

function atomSchema<P>(p: z.ZodSchema<P>): z.ZodSchema<F<P>> {
  return z.object({
    kind: z.literal('atom'),
    property: p,
    value: z.boolean(),
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

export interface Atom<P> {
  kind: 'atom'
  property: P
  value: boolean
}

export interface And<P> {
  kind: 'and'
  subs: Formula<P>[]
}

export interface Or<P> {
  kind: 'or'
  subs: Formula<P>[]
}

export type Formula<P> = And<P> | Or<P> | Atom<P>

export function and<P>(...subs: Formula<P>[]): And<P> {
  return { kind: 'and', subs: subs }
}

export function or<P>(...subs: Formula<P>[]): Or<P> {
  return { kind: 'or', subs: subs }
}

export function atom<P>(p: P, v = true): Atom<P> {
  return { kind: 'atom', property: p, value: v }
}

export function properties<P>(f: Formula<P>): Set<P> {
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
      return atom(formula.property, !formula.value)
    case 'and':
      return or(...formula.subs.map(negate))
    case 'or':
      return and(...formula.subs.map(negate))
  }
}

export function map<P, Q>(
  func: (p: Atom<P>) => Atom<Q>,
  formula: Formula<P>,
): Formula<Q> {
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

export function mapProperty<P, Q>(
  func: (p: P) => Q,
  formula: Formula<P>,
): Formula<Q> {
  function mapAtom(a: Atom<P>): Atom<Q> {
    return { ...a, property: func(a.property) }
  }
  return map<P, Q>(mapAtom, formula)
}

export function compact<P>(f: Formula<P | undefined>): Formula<P> | undefined {
  return properties(f).has(undefined) ? undefined : (f as Formula<P>)
}

export function evaluate<T>(
  f: Formula<T>,
  traits: Map<T, boolean>,
): boolean | undefined {
  let result: boolean | undefined

  switch (f.kind) {
    case 'atom':
      if (traits.has(f.property)) {
        return traits.get(f.property) === f.value
      }
      return undefined
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

export function parse(q?: string): Formula<string> | undefined {
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

type Serialized =
  | { and: Serialized[] }
  | { or: Serialized[] }
  | { property: string; value: boolean }
  | Record<string, boolean>

export function fromJSON(json: Serialized): Formula<string> {
  if ('and' in json && typeof json.and === 'object') {
    return and<string>(...json.and.map(fromJSON))
  } else if ('or' in json && typeof json.or === 'object') {
    return or<string>(...json.or.map(fromJSON))
  } else if ('property' in json && typeof json.property === 'string') {
    return atom<string>(json.property, json.value)
  }

  const entries = Object.entries(json)
  if (entries.length !== 1) {
    throw `cannot cast object with ${entries.length} keys to atom`
  }

  if (typeof entries[0][1] !== 'boolean') {
    throw `cannot cast object with non-boolean value`
  }

  return atom<string>(...entries[0])
}

export function toJSON(f: Formula<string>): Serialized {
  switch (f.kind) {
    case 'atom':
      return { [f.property]: f.value }
    case 'and':
      return { and: f.subs.map(toJSON) }
    case 'or':
      return { or: f.subs.map(toJSON) }
  }
}
