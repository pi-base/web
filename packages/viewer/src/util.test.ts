import { and, atom, property, theorem } from '@pi-base/core/lib/testUtils'

import { index } from './stores/collection'
import { hydrate } from './util'

describe('hydrate', () => {
  const p1 = property({ uid: 'P000001' })
  const p2 = property({ uid: 'P000002' })
  const p3 = property({ uid: 'P000003' })

  const raw = theorem({
    uid: 'T000001',
    when: and(atom('P000001'), atom('P000002')),
    then: atom('P000003'),
  })

  it('creates formulae with full properties', () => {
    const properties = index([p1, p2, p3], (p) => p.uid)

    const hydrated = hydrate(raw, properties)!

    expect(hydrated.when).toEqual(and(atom(p1), atom(p2)))
    expect(hydrated.then).toEqual(atom(p3))
    expect(hydrated.name).toEqual('(P000001 ∧ P000002) ⇒ P000003')
  })

  it('returns undefined if references are not present', () => {
    const properties = index([p1, p3], (p) => p.uid)

    expect(hydrate(raw, properties)).toBeUndefined()
  })
})
