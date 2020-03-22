import React from 'react'

import { mount, property } from '../../__test__'
import { Property } from '../../models'

import List from './List'

const properties: Property[] = [
  property({ uid: 'P1' }),
  property({ uid: 'P2' })
]

describe('List', () => {
  it('renders rows for each property', () => {
    const component = mount(
      <List properties={properties} />,
    )

    expect(component.exists('Filter')).toEqual(true)
    expect(component.find('Row').map(r => r.prop('item'))).toEqual(properties)
  })
})
