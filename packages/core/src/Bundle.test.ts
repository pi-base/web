import { Bundle, deserialize, serialize } from './Bundle'

import { property, space, trait } from './testUtils'

describe('Bundle', () => {
  describe('serialization', () => {
    function roundtrip(name: string, bundle: Bundle) {
      it(`roundtrips ${name}`, () => {
        expect(
          deserialize(JSON.parse(JSON.stringify(serialize(bundle)))),
        ).toEqual(bundle)
      })
    }

    roundtrip(
      'full',
      new Bundle(
        [
          property({ uid: 'P1' }),
          property({ uid: 'P2' }),
          property({ uid: 'P3' }),
        ],
        [
          space({
            uid: 'S1',
            refs: [
              { name: 'doi', doi: 'doi' },
              { name: 'wikipedia', wikipedia: 'wikipedia' },
              { name: 'mr', mr: 'mr' },
              { name: 'mathse', mathse: 'mathse' },
              { name: 'mo', mo: 'mo' },
            ],
          }),
        ],
        [],
        [trait({ space: 'S1', property: 'P1' })],
        { ref: 'test', sha: 'HEAD' },
      ),
    )
  })
})
