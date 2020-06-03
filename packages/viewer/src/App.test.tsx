import React from 'react'
import { mount } from 'enzyme'

import { act, defaultStore, updateWrapper } from './__test__'

import { Dispatch, check } from './actions'

import App from './App'

import Nav from './components/Nav'
import Main from './components/Main'

async function startup(dispatch: Dispatch) {
  dispatch({ action: 'loaded', value: defaultStore })
}

describe('App', () => {
  it('renders correctly', async () => {
    const component = mount(<App startup={startup} />)
    await updateWrapper(component)

    expect(component.find(Nav)).toHaveLength(1)
    expect(component.find(Main)).toHaveLength(1)

    expect(component).toMatchSnapshot()
  })
})
