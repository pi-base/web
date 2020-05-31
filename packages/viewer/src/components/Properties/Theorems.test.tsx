import React from 'react'

import { defaultStore as store, mount } from '../../__test__'

import Theorems from './Theorems'
import List from '../Theorems/SummaryList'

describe('List', () => {
  it('renders rows for each property', () => {
    const component = mount(
      <Theorems property={store.bundle.properties.get('P1')!} />
    )

    const theorems = component.find(List).prop('theorems')

    expect(theorems.map(t => t.uid)).toContain('T1')
  })
})
