import { and, atom, or } from './Formula'
import { Contradiction, Derivations, deduceTraits, proveTheorem } from './Logic'
import ImplicationIndex from './Logic/ImplicationIndex'
import { index, recordToMap } from './__test__'

describe('deduceTraits', () => {
  let contradiction: Contradiction<number> | undefined
  let deductions: Derivations<number>

  beforeEach(() => {
    contradiction = undefined
    deductions = new Derivations()
  })

  function run(
    theorems: ImplicationIndex<number>,
    traits: Record<string, boolean>
  ): void {
    const result = deduceTraits(theorems, recordToMap(traits))
    if (result.kind === 'contradiction') {
      contradiction = result.contradiction
    } else {
      deductions = result.derivations
    }
  }

  const theorems = index(
    [atom('P'), atom('Q')],
    [atom('Q'), atom('R')],
    [atom('R'), or(atom('S'), atom('T'))],
    [and(atom('X'), atom('Y')), atom('T', false)]
  )

  describe('chained proofs', () => {
    beforeEach(() => {
      run(theorems, {
        P: true,
        S: false,
        X: true,
      })
    })

    it('does not find a contradiction', () => {
      expect(contradiction).toBeUndefined()
    })

    it('proves the expected traits', () => {
      expect(deductions.all()).toEqual([
        {
          property: 'Q',
          value: true,
          proof: { properties: ['P'], theorems: [1] },
        },
        {
          property: 'R',
          value: true,
          proof: { properties: ['P'], theorems: [1, 2] },
        },
        {
          property: 'T',
          value: true,
          proof: { properties: ['S', 'P'], theorems: [1, 2, 3] },
        },
        {
          property: 'Y',
          value: false,
          proof: { properties: ['X', 'S', 'P'], theorems: [1, 2, 3, 4] },
        },
      ])
    })
  })
})

describe('proveTheorem', () => {
  const theorems = index(
    [and(atom('P'), atom('Q')), atom('R')],
    [atom('R'), atom('P')],
    [atom('R'), atom('S')],
    [atom('S'), atom('Q')]
  )

  it('can find a chained proof', () => {
    const proof = proveTheorem(theorems, atom('R'), atom('Q'))

    expect(proof).toEqual([3, 4])
  })

  it('can identify a tautology', () => {
    const proof = proveTheorem(index(), atom('P'), atom('P'))

    expect(proof).toEqual('tautology')
  })

  it('can fail to find a proof', () => {
    const proof = proveTheorem(theorems, atom('P'), atom('P', false))

    expect(proof).toBeUndefined()
  })
})
