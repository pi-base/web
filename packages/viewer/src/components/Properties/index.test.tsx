import React from 'react'

import { mountedAt } from '../../__test__'

import Properties from './index'

import Detail from './Detail'
import List from './List'
import NotFound from '../Shared/NotFound'

describe('Properties', () => {
  it('can route to the index', () => {
    const component = mountedAt(<Properties />, '/')

    const list = component.find(List)

    expect(list.prop('properties').length).toBeGreaterThanOrEqual(2)
  })

  it('can route to a detailed view', () => {
    const component = mountedAt(<Properties />, '/P1')

    const detail = component.find(Detail)
    const property = detail.prop('property')

    expect(property.uid).toEqual('P1')
  })

  it('renders not found', () => {
    const component = mountedAt(<Properties />, '/P999')

    expect(component.exists(NotFound)).toEqual(true)
  })
})
