import { parse as _parse } from './Formula/Grammar'
import { union } from './Util'

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

export function atom<P>(p: P, v: boolean = true): Atom<P> {
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
      const name = term(f.property)
      return f.value ? name : '¬' + name
    case 'and':
      return '(' + f.subs.map(sf => render(sf!, term)).join(' ∧ ') + ')'
    case 'or':
      return '(' + f.subs.map(sf => render(sf!, term)).join(' ∨ ') + ')'
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

export function map<P, Q>(func: (p: Atom<P>) => Atom<Q>, formula: Formula<P>): Formula<Q> {
  switch (formula.kind) {
    case 'atom':
      return func(formula)
    default:
      return {
        ...formula,
        subs: formula.subs.map(sub => map(func, sub!))
      }
  }
}

export function mapProperty<P, Q>(func: (p: P) => Q, formula: Formula<P>): Formula<Q> {
  function mapAtom(a: Atom<P>): Atom<Q> {
    return { ...a, property: func(a.property) }
  }
  return map<P, Q>(mapAtom, formula)
}

export function evaluate<T>(f: Formula<T>, traits: Map<T, boolean>): boolean | undefined {
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
        if (result === false) { return }
        const sv = evaluate(sub!, traits)
        if (sv === false) { // definitely false
          result = false
        } else if (result && sv === undefined) { // maybe false
          result = undefined
        }
      })
      return result
    case 'or':
      result = false
      f.subs.forEach(sub => {
        if (result === true) { return }
        const sv = evaluate(sub!, traits)
        if (sv === true) { // definitely true
          result = true
        } else if (result === false && sv === undefined) { // maybe true
          result = undefined
        }
      })
      return result
  }
}

export function parse(q?: string): Formula<string> | undefined {
  if (!q) { return }

  let parsed
  try {
    parsed = _parse(q)
  } catch {
    if (q && q.startsWith('(')) {
      return
    } else {
      return parse('(' + q + ')')
    }
  }

  return fromJSON(parsed)
}

export function fromJSON(json: any): Formula<string> {
  if (json.and) {
    return and<string>(...json.and.map(fromJSON))
  } else if (json.or) {
    return or<string>(...json.or.map(fromJSON))
  } else if (json.property) {
    return atom<string>(json.property, json.value)
  } else {
    const property = Object.keys(json)[0]
    return atom<string>(property, json[property])
  }
}

export function toJSON(f: Formula<string>): object {
  switch (f.kind) {
    case 'atom':
      return { [f.property]: f.value }
    case 'and':
      return { and: f.subs.map(toJSON) }
    case 'or':
      return { or: f.subs.map(toJSON) }
  }
}
