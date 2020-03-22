// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import 'jest-enzyme'

import enzyme from 'enzyme'
import enzymeAdapter from 'enzyme-adapter-react-16'
import jestFetchMock from 'jest-fetch-mock'
import * as immer from 'immer'

enzyme.configure({ adapter: new enzymeAdapter() })
jestFetchMock.enableMocks()
immer.enableMapSet()
