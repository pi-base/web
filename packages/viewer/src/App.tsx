import React, { useMemo, useRef, useReducer } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'

import { boot, save } from './actions'
import { Reducer, reducer, initial } from './reducers'
import * as Error from './errors'
import { Provider } from './models/Store/context'
import Nav from './components/Nav'
import Main from './components/Main'
import StatusBar from './components/StatusBar'
import { debounce } from './util'

const debouncedSave = debounce(save)

export default function App({
  errorHandler = Error.log()
}: {
  errorHandler?: Error.Handler
}) {
  const [{ status, store }, dispatch] = useReducer<Reducer>(reducer, initial)

  const savedStore = useRef(store)
  if (savedStore.current !== store) {
    debouncedSave(store)
    savedStore.current = store
  }

  useMemo(() => boot(dispatch), [dispatch])

  return (
    <Error.Provider value={errorHandler}>
      <Router>
        <Provider value={store}>
          <StatusBar status={status} />
          <Nav />
          <Main dispatch={dispatch} />
        </Provider >
      </Router>
    </Error.Provider>
  )
}
