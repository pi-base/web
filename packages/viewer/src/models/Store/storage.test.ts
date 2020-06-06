import { Store, initial } from './state'
import { deserialize, serialize } from './storage'

import { defaultStore } from '../../__test__'

describe('storage', () => {
  describe('serialization', () => {
    function roundtrip(name: string, store: Store) {
      it(`roundtrips ${name}`, () => {
        expect(
          deserialize(JSON.parse(JSON.stringify(serialize(store))))
        ).toEqual(store)
      })
    }

    roundtrip('initial', initial)
    roundtrip('defaultStore', defaultStore)
  })
})
