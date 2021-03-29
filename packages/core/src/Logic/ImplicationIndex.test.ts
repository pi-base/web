import { atom, or } from '../Formula'
import { index } from '../__test__'

describe('ImplicationIndex', () => {
  const theorems = index(
    [atom('A'), atom('B')],
    [atom('B'), or(atom('C'), atom('D'))],
  )

  it('can return all items', () => {
    expect(theorems.all.length).toEqual(2)
  })

  describe('withProperty', () => {
    function idsWithProperty(property: string) {
      return [...theorems.withProperty(property)].map((t) => t.id).sort()
    }

    it('finds by property name', () => {
      expect(idsWithProperty('D')).toEqual([2])
    })

    it('can match multiple implications', () => {
      expect(idsWithProperty('B')).toEqual([1, 2])
    })

    it('can fail to find', () => {
      expect(idsWithProperty('Z')).toEqual([])
    })
  })
})
