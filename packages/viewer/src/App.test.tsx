import React from 'react'
import { mount } from 'enzyme'

import { bundle } from '@pi-base/core'

import { fetch, updateWrapper } from './__test__'

import App from './App'

import Nav from './components/Nav'
import Main from './components/Main'

describe('App', () => {
  it('renders correctly', async () => {
    fetch.mockOnce(
      JSON.stringify(
        {
          spaces: [],
          properties: [],
          traits: [],
          theorems: [],
          version: {
            ref: "test",
            sha: "HEAD"
          }
        }
      )
    )

    const component = mount(<App />)
    await updateWrapper(component)

    expect(component.find(Nav)).toHaveLength(1)
    expect(component.find(Main)).toHaveLength(1)

    expect(component).toMatchSnapshot()
  })
})
