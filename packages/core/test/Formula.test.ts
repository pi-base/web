import { describe, expect, it } from 'vitest'
import {
  Formula,
  Or,
  and,
  atom,
  compact,
  evaluate,
  fromJSON,
  negate,
  or,
  map,
  mapProperty,
  parse,
  properties,
  render,
  toJSON,
} from '../src/Formula'

const compound = and<string>(
  atom('compact'),
  or(atom('connected'), atom('separable', false)),
  atom('first countable', false),
)

const render_ = (f: Formula<string>) => render(f, (p: string) => p)

describe('Formula', () => {
  describe('structure', () => {
    it('has accessors', () => {
      const f = compound

      expect(f.subs[0]).toEqual(atom('compact'))
      expect((f.subs[1] as Or<string>).subs[1]).toEqual(
        atom('separable', false),
      )
    })
  })

  describe('properties', () => {
    it('builds a set of properties', () => {
      const props = properties(compound)

      expect(props).toEqual(
        new Set(['compact', 'connected', 'separable', 'first countable']),
      )
    })
  })

  describe('render', () => {
    it('can render an atom', () => {
      expect(render_(atom('P', false))).toEqual('¬P')
    })

    it('can render to string', () => {
      expect(render_(compound)).toEqual(
        '(compact ∧ (connected ∨ ¬separable) ∧ ¬first countable)',
      )
    })
  })

  describe('negate', () => {
    it('can negate an atom', () => {
      expect(negate(atom('P', true))).toEqual(atom('P', false))
    })

    it('can negate a compound formula', () => {
      expect(render_(negate(compound))).toEqual(
        '(¬compact ∨ (¬connected ∧ separable) ∨ first countable)',
      )
    })
  })

  describe('map', () => {
    it('maps over entire atoms', () => {
      const result = map(
        term => atom<string>(term.property.slice(0, 2), !term.value),
        compound,
      )

      expect(render_(result)).toEqual('(¬co ∧ (¬co ∨ se) ∧ fi)')
    })
  })

  describe('mapProperty', () => {
    it('only maps over properties', () => {
      const result = mapProperty(property => property.slice(0, 2), compound)

      expect(render_(result)).toEqual('(co ∧ (co ∨ ¬se) ∧ ¬fi)')
    })
  })

  describe('compact', () => {
    it('preserves null-valued atoms', () => {
      const f = and(atom('A'), atom('B', null), atom('C', false))

      expect(compact(f)).toEqual(f)
    })
  })

  describe('evaluate', () => {
    it('is true if all subs are true', () => {
      const traits = new Map([
        ['compact', true],
        ['connected', true],
        ['first countable', false],
      ])

      expect(evaluate(compound, traits)).toEqual(true)
    })

    it('is false if a sub is false', () => {
      const traits = new Map([
        ['compact', true],
        ['connected', false],
        ['separable', true],
        ['first countable', false],
      ])

      expect(evaluate(compound, traits)).toEqual(false)
    })

    const traits = new Map([
      ['compact', true],
      ['first countable', false],
    ])

    it('is undefined if a sub is undefined', () => {
      expect(evaluate(compound, traits)).toEqual(undefined)
    })

    it('can match null', () => {
      expect(evaluate(parse('?other')!, traits)).toEqual(true)
    })

    it('can fail to match null', () => {
      expect(evaluate(parse('?compact')!, traits)).toEqual(false)
    })
  })
})

describe('parsing', () => {
  it('can parse a simple formula', () => {
    expect(parse('Compact')).toEqual(atom('Compact', true))
  })

  it('handles whitespace', () => {
    expect(parse('   \t   Second Countable \n ')).toEqual(
      atom('Second Countable', true),
    )
  })

  it('can negate properties', () => {
    expect(parse('not compact')).toEqual(atom('compact', false))
  })

  it('can mark properties unknown', () => {
    expect(parse('?compact')).toEqual(atom('compact', null))
  })

  it('inserts parens', () => {
    expect(parse('compact + connected + ~t_2')).toEqual(
      and(atom('compact', true), atom('connected', true), atom('t_2', false)),
    )
  })

  it('allows parens', () => {
    expect(parse('(foo + bar)')).toEqual(and(atom('foo'), atom('bar')))
  })

  it('handles errors with parens', () => {
    expect(parse('(some stuff + |)')).toBeUndefined()
  })

  it('can parse nested formulae', () => {
    expect(
      parse(
        'compact + (connected || not second countable) + ~first countable',
      )!,
    ).toEqual(
      and(
        atom('compact', true),
        or(atom('connected', true), atom('second countable', false)),
        atom('first countable', false),
      ),
    )
  })

  it('handles empty strings', () => {
    expect(parse()).toBeUndefined()
    expect(parse('')).toBeUndefined()
  })
})

describe('serialization', () => {
  const formulae = [
    atom('A', false),
    or(atom('B', true), atom('C', false)),
    compound,
  ]

  formulae.forEach(formula => {
    it(`roundtrips ${render_(formula)}`, () => {
      expect(fromJSON(toJSON(formula))).toEqual(formula)
    })
  })

  it('throws when given multiple keys', () => {
    expect(() =>
      fromJSON({
        P1: true,
        P2: false,
      }),
    ).toThrowError('cast')
  })

  it('throws when given multiple keys', () => {})
})
