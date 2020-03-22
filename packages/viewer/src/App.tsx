import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'
import * as Error from './errors'

import Nav from './components/Nav'
import Main from './components/Main'
import StatusBar from './components/StatusBar'

import produce from 'immer'
import { useMemo, useReducer } from 'react'

import { Space } from './models'
import { Status, Store } from './models/Store/state'
import * as S from './models/Store/state'
import { load, save } from './models/Store/storage'
import { Provider } from './models/Store/context'

type Action
  = { action: 'loadError' } // TODO: handle this
  | { action: 'loaded', value: Store }
  | { action: 'checking', count: number }
  | { action: 'check', space: Space }
  | { action: 'ready' }
  | { action: 'save' }

type State = {
  status: Status
  store: Store
}

const initial: State = {
  store: S.initial,
  status: { state: 'fetching' }
}

const reducer: React.Reducer<State, Action> = produce((state: State, action: Action) => {
  switch (action.action) {
    case 'loaded':
      Object.assign(state.store, action.value)
      return
    case 'checking':
      state.status = { state: 'checking', complete: 0, total: action.count }
      return
    case 'check':
      check(state, action.space)
      return
    case 'ready':
      save(state.store)
      state.status = { state: 'ready' }
      return
  }
})

async function boot(
  dispatch: React.Dispatch<Action>,
  branch: string
) {
  const loaded = await load(branch)
  if (!loaded) {
    dispatch({ action: 'loadError' })
    return
  }

  dispatch({ action: 'loaded', value: loaded })

  const toCheck = Array.from(loaded.spaces.values()).filter(space => !loaded.checked.has(space.uid))
  dispatch({ action: 'checking', count: toCheck.length })

  for (let i = 0; i < toCheck.length; i++) {
    dispatch({ action: 'check', space: toCheck[i] })
    await pause()
  }

  dispatch({ action: 'ready' })
}

async function pause(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 0)
  })
}

function check(state: State, space: Space) {
  if (state.status.state === 'checking') {
    state.status.complete = state.status.complete + 1
  }

  S.check(state.store, space)
}

export default function App({
  errorHandler = Error.log()
}: {
  errorHandler?: Error.Handler
}) {
  const [{ status, store }, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initial)

  useMemo(() => boot(dispatch, 'master').catch(e => console.log(e)), [dispatch])

  return (
    <Error.Provider value={errorHandler}>
      <Router>
        <Provider value={store}>
          <StatusBar status={status} />
          <Nav />
          <Main />
        </Provider >
      </Router>
    </Error.Provider>
  )
}
