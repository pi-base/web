import React from 'react'

import { formula as F } from '@pi-base/core'

import { mount } from '../../__test__'

import Formula from './Formula'

describe('Formula', () => {
  it('looks up property keys', () => {
    const f = F.or(
      F.and(
        F.atom('P1'),
        F.atom('P2', false)
      ),
      F.atom('P3')
    )

    const wrapper = mount(<Formula value={f} link="property" />)

    expect(
      wrapper.text()
    ).toEqual('((P1 Λ ¬P2) ∨ P3)')
  })
})