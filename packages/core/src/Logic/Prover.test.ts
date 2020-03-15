import { and, atom, or } from '../Formula'
import Prover, { prove } from './Prover'

const theorems = [
  {
    uid: '1',
    when: atom('P'),
    then: atom('Q'),
  },
  {
    uid: '2',
    when: atom('Q'),
    then: atom('R'),
  },
  {
    uid: '3',
    when: atom('R'),
    then: or(
      atom('S'),
      atom('T')
    )
  },
  {
    uid: '4',
    when: and(
      atom('X'),
      atom('Y')
    ),
    then: atom('T', false)
  }
]

describe('Prover', () => {
  describe('apply', () => {
    it('applies direct implications', () => {
      const prover = Prover.build(
        [],
        [
          ['P', true]
        ]
      )

      prover.apply(theorems[0])

      const q = prover.proof('Q')!

      expect(q).toEqual({
        properties: ['P'],
        theorems: ['1']
      })
    })

    it('finds direct contradictions', () => {
      const prover = Prover.build(
        [],
        [
          ['P', true],
          ['Q', false],
        ]
      )

      const contradiction = prover.apply(theorems[0])!

      expect(contradiction.theorems).toEqual(['1'])
      expect(contradiction.properties).toEqual(['P', 'Q'])
    })

    it('cannot force a partial OR', () => {
      const prover = Prover.build(
        [],
        [
          ['A', true]
        ]
      )

      const result = prover.apply({
        uid: '1',
        when: atom('A'),
        then: or(atom('B'), atom('C'))
      })

      expect(result).toBeUndefined
      expect(prover.traits.get('B')).toBeUndefined
      expect(prover.proof('B')).toBeUndefined
    })

    it('can force an OR where part is known', () => {
      const prover = Prover.build(
        [],
        [
          ['A', true],
          ['C', false]
        ]
      )

      const result = prover.apply({
        uid: '1',
        when: atom('A'),
        then: or(atom('B'), atom('C'))
      })

      expect(result).toBeUndefined
      expect(prover.traits.get('B')).toEqual(true)
      expect(prover.proof('B')).toEqual({
        properties: ['A', 'C'],
        theorems: ['1']
      })
    })

    it('cannot force an OR where all parts are known false', () => {
      const prover = Prover.build(
        [],
        [
          ['A', true],
          ['B', false],
          ['C', false]
        ]
      )

      const result = prover.apply({
        uid: '1',
        when: atom('A'),
        then: or(atom('B'), atom('C'))
      })

      expect(result).toEqual({
        properties: ['A', 'B', 'C'],
        theorems: ['1']
      })
    })

    it('records assumptions as given', () => {
      const prover = Prover.build([], [['A', true]])

      expect(prover.proof('A')).toEqual('given')
    })
  })

  describe('force', () => {
    describe('OR', () => {
      it('finds a contradiction', () => {
        const prover = Prover.build(
          [],
          [
            ['A', false],
            ['B', false]
          ]
        )

        const result = prover.force('1', or(atom('A'), atom('B')), new Set())

        expect(result).toEqual({
          properties: ['A', 'B'],
          theorems: ['1']
        })
      })

      it('can fail', () => {
        const prover = Prover.build(
          [],
          [
            ['B', false]
          ]
        )

        const result = prover.force(
          '1',
          or(
            atom('A'),
            atom('B'),
            atom('C'),
            atom('D')
          ),
          new Set()
        )

        expect(result).toBeUndefined
        expect(prover.traits.get('A')).toBeUndefined
        expect(prover.proof('A')).toBeUndefined
      })
    })
  })

  describe('run', () => {
    describe('chained proofs', () => {
      const prover = Prover.build(
        theorems,
        [
          ['P', true],
          ['S', false],
          ['X', true]
        ]
      )

      const result = prover.run()

      it('does not find a contradiction', () => {
        expect(result).toBeUndefined
      })

      it('proves the expected traits', () => {
        expect(prover.traits).toEqual(new Map([
          ['P', true],
          ['Q', true],
          ['R', true],
          ['S', false],
          ['T', true],
          ['X', true],
          ['Y', false]
        ]))
      })

      it('traces proofs back to assumptions', () => {
        expect(prover.proof('R')).toEqual({
          theorems: ['1', '2'],
          properties: ['P']
        })
      })

      it('can provide a detailed proof', () => {
        expect(prover.proof('Y')).toEqual({
          theorems: ['3', '2', '1', '4'],
          properties: ['X', 'S', 'P']
        })
      })
    })
  })
})

describe('prove', () => {
  const theorems = [
    {
      uid: '1',
      when: and(atom('P'), atom('Q')),
      then: atom('R')
    },
    {
      uid: '2',
      when: atom('R'),
      then: atom('P')
    },
    {
      uid: '3',
      when: atom('R'),
      then: atom('S')
    },
    {
      uid: '4',
      when: atom('S'),
      then: atom('Q')
    },
  ]

  it('can find a chained proof', () => {
    const proof = prove(
      theorems,
      atom('R'),
      atom('Q')
    )

    expect(proof).toEqual(['3', '4'])
  })

  it('can identify a tautology', () => {
    const proof = prove(
      [],
      atom('P'),
      atom('P')
    )

    expect(proof).toEqual('tautology')
  })

  it('can fail to find a proof', () => {
    const proof = prove(
      theorems,
      atom('P'),
      atom('P', false)
    )

    expect(proof).toBeUndefined
  })
})
