import React, { useRef, useReducer } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'

import { boot, save } from './actions'
import * as Error from './errors'
import { useChange } from './hooks'
import { Dispatch, Reducer, reducer, initial } from './reducers'
import { status } from './models/Store/state'
import { Provider } from './models/Store/context'
import Nav from './components/Nav'
import Main from './components/Main'
import StatusBar from './components/StatusBar'
import { debounce } from './util'

const debouncedSave = debounce(save)

export default function App({
  errorHandler = Error.log(),
  startup = boot
}: {
  errorHandler?: Error.Handler
  startup?: (dispatch: Dispatch, errorHandler: Error.Handler) => Promise<void>
}) {
  const [store, dispatch] = useReducer<Reducer>(reducer, initial)

  useChange(store, debouncedSave)

  const booted = useRef(false)
  if (!booted.current) {
    booted.current = true
    startup(dispatch, errorHandler)
  }

  return (
    <Error.Provider value={errorHandler}>
      <Router>
        <Provider value={store}>
          <StatusBar status={status(store)} />
          <Nav />
          <Main dispatch={dispatch} handler={errorHandler} />
        </Provider >
      </Router>
    </Error.Provider>
  )
}
