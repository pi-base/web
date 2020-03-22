import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'

import Nav from './Nav'

describe('Nav', () => {
  it('renders correctly', () => {
    const component = render(
      <Router>
        <Nav />
      </Router>
    )

    expect(component).toMatchSnapshot()
  })
})
