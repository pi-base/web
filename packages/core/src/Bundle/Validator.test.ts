import Bundle from '../Bundle'
import { Formula, and, atom } from '../Formula'
import { Property } from '../Property'
import { Space } from '../Space'
import { Trait } from '../Trait'
import { Theorem } from '../Theorem'

import { run } from './Validator'

const p = (uid: string, opts?: Partial<Property>): Property => ({
  name: uid,
  slug: uid,
  aliases: [],
  description: uid,
  counterexamples_id: undefined,
  refs: [],
  ...opts,
  uid
})

const s = (uid: string, opts?: Partial<Space>): Space => ({
  name: uid,
  slug: uid,
  aliases: [],
  description: uid,
  counterexamples_id: undefined,
  ambiguous_construction: false,
  refs: [],
  ...opts,
  uid
})

const tr = (space: string, property: string, opts?: Partial<Trait>): Trait => ({
  description: '',
  value: true,
  uid: '',
  counterexamples_id: undefined,
  refs: [],
  ...opts,
  space,
  property
})

const th = (uid: string, when: Formula<string>, then: Formula<string>, opts?: Partial<Theorem>): Theorem => ({
  description: '',
  counterexamples_id: undefined,
  refs: [],
  ...opts,
  uid,
  when,
  then
})

describe('Validator', () => {
  const version = { ref: 'test', sha: 'head' }

  const check = (properties: Property[], spaces: Space[], theorems: Theorem[], traits: Trait[]) =>
    run(new Bundle(properties, spaces, theorems, traits, version))

  describe('run', () => {
    it('returns nothing if there are no errors', () => {
      const errors = check(
        [p('1'), p('2')],
        [s('1'), s('2')],
        [th('1', atom('1'), atom('2'))],
        [tr('1', '1')],
      )

      expect(errors).toEqual(undefined)
    })

    it('finds traits with missing references', () => {
      const errors = check(
        [p('1')],
        [s('2')],
        [],
        [tr('1', '1'), tr('2', '2')],
      )

      expect(errors).toEqual({
        traits: new Map([
          [['1', '1'], ['Missing space: 1']],
          [['2', '2'], ['Missing space: 2']]
        ])
      })
    })

    it('finds theorems with missing references', () => {
      const errors = check(
        [p('1'), p('2')],
        [],
        [
          th('1', atom('3'), and(atom('2'), atom('4'))),
          th('2', atom('2'), atom('1'))
        ],
        [],
      )

      expect(errors).toEqual({
        theorems: new Map([
          ['1', ['Missing properties: 3, 4']],
        ])
      })
    })

    it('finds contradictions amongst theorems and traits', () => {
      const errors = check(
        [p('1'), p('2'), p('3')],
        [s('1')],
        [
          th('1', atom('1'), atom('2')),
          th('2', atom('2'), atom('3'))
        ],
        [
          tr('1', '1'),
          tr('1', '3', { value: false })
        ],
      )

      expect(errors).toEqual({
        spaces: new Map([
          ['1', ['Contradiction: theorems 1, 2 and properties 3, 1']]
        ])
      })
    })
  })
})

