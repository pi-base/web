import React, { useState } from 'react'
import { mount } from 'enzyme'

import Input, { DOWN, ENTER, TAB, UP } from './FormulaInput'

function getSuggestions() {
  return [
    'Alpha',
    'Bravo',
    'Charlie'
  ]
}

describe('FormulaInput', () => {
  function Component() {
    const [value, setValue] = useState("")

    return (
      <Input
        getSuggestions={getSuggestions}
        onChange={setValue}
        value={value}
      />
    )
  }

  it('suggests when the user starts typing', () => {
    const wrapper = mount(<Component />)

    // No suggestions are visible initially
    expect(wrapper.find('Suggestions').length).toEqual(0)
    expect(wrapper).toMatchSnapshot()

    // Suggestions appear as the user starts typing
    wrapper.
      find('input').
      simulate('change', { target: { value: 'a' } })

    expect(wrapper.find('Suggestions').length).toEqual(1)
    expect(wrapper).toMatchSnapshot()

    // The user can select suggestions with keypresses
    wrapper.
      find('input').
      simulate('keydown', { keyCode: DOWN }).
      simulate('keydown', { keyCode: TAB })

    expect(wrapper.find('input').prop('value')).toEqual('Alpha')
    expect(wrapper).toMatchSnapshot()

    // Subsequent updates only update the fragment
    wrapper.
      find('input').
      simulate('change', { target: { value: 'Alpha + C' } }).
      simulate('keydown', { keyCode: UP }).
      simulate('keydown', { keyCode: ENTER })

    expect(wrapper.find('input').prop('value')).toEqual('Alpha + Charlie')
    expect(wrapper).toMatchSnapshot()
  })
})
