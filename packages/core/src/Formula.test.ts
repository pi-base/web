import * as F from './Formula'
import {
  Formula,
  and,
  atom,
  evaluate,
  fromJSON,
  negate,
  or,
  parse,
  properties,
  render,
  toJSON,
} from './Formula'

const compound: Formula<string> = and(
  atom('compact', true),
  or(atom('connected', true), atom('separable', false)),
  atom('first countable', false),
)

const render_ = (f: Formula<string>) => render(f, (p: string) => p)

describe('Formula', () => {
  describe('structure', () => {
    it('has accessors', () => {
      const f = compound

      expect(f.subs[0]).toEqual(atom('compact'))
      expect((f.subs[1] as F.Or<string>).subs[1]).toEqual(
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
      const result = F.map(
        term => atom(term.property.slice(0, 2), !term.value),
        compound,
      )

      expect(render_(result)).toEqual('(¬co ∧ (¬co ∨ se) ∧ fi)')
    })
  })

  describe('mapProperty', () => {
    it('only maps over properties', () => {
      const result = F.mapProperty(property => property.slice(0, 2), compound)

      expect(render_(result)).toEqual('(co ∧ (co ∨ ¬se) ∧ ¬fi)')
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

    it('is undefined if a sub is undefined', () => {
      const traits = new Map([
        ['compact', true],
        ['first countable', false],
      ])

      expect(evaluate(compound, traits)).toEqual(undefined)
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

  it('inserts parens', () => {
    expect(parse('compact + connected + ~t_2')).toEqual(
      and(atom('compact', true), atom('connected', true), atom('t_2', false)),
    )
  })

  it('allows parens', () => {
    expect(F.parse('(foo + bar)')).toEqual(
      F.and(F.atom('foo', true), F.atom('bar', true)),
    )
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
  ;[atom('A', false), or(atom('B', true), atom('C', false)), compound].forEach(
    formula => {
      it(`roundtrips ${render_(formula)}`, () => {
        expect(fromJSON(toJSON(formula))).toEqual(formula)
      })
    },
  )
})
