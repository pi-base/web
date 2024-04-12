import { describe, expect, it } from 'vitest'
import { Bundle, deserialize, serialize } from '../src/Bundle'
import { Theorem } from '../src/Theorem'

import { property, space, trait } from '../src/testUtils'

describe('Bundle', () => {
  describe('serialization', () => {
    function roundtrip(name: string, bundle: Bundle) {
      it(`roundtrips ${name}`, () => {
        expect(
          deserialize(JSON.parse(JSON.stringify(serialize(bundle)))),
        ).toEqual(bundle)
      })
    }

    roundtrip('full', {
      properties: new Map([
        ['P1', property({ uid: 'P1' })],
        ['P2', property({ uid: 'P2' })],
        ['P3', property({ uid: 'P3' })],
      ]),
      spaces: new Map([
        [
          'S1',
          space({
            uid: 'S1',
            refs: [
              { name: 'doi', doi: 'doi' },
              { name: 'wikipedia', wikipedia: 'wikipedia' },
              { name: 'mr', mr: 'mr' },
              { name: 'mathse', mathse: 1 },
              { name: 'mo', mo: 2 },
              { name: 'zbmath', zbmath: 'zbmath' },
            ],
          }),
        ],
      ]),
      traits: new Map([['S1|P1', trait({ space: 'S1', property: 'P1' })]]),
      theorems: new Map<string, Theorem>(),
      version: { ref: 'test', sha: 'HEAD' },
    })
  })
})
