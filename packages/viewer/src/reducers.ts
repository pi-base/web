import React from 'react'

import produce from 'immer'

import { Action } from './actions'
import { Status, Store } from './models/Store/state'
import * as S from './models/Store/state'

type State = {
  status: Status
  store: Store
}

// TODO: push status up to store, and just use Store instead of State
export const initial: State = {
  store: S.initial,
  status: { state: 'fetching' }
}

export type Reducer = React.Reducer<State, Action>

export const reducer: Reducer = produce((state: State, action: Action) => {
  switch (action.action) {
    case 'loaded':
      Object.assign(state.store, action.value)
      return
    case 'checking':
      state.status = { state: 'checking', complete: 0, total: action.count }
      return
    case 'check':
      if (state.status.state === 'checking') {
        state.status.complete = state.status.complete + 1
      }
      S.check(state.store, action.space)
      return
    case 'ready':
      state.status = { state: 'ready' }
      return
    case 'fetching':
      state.store.remote.branch = action.branch
      state.store.remote.host = action.host
      state.store.remote.state = 'fetching'
      state.store.remote.state = 'fetching'
      state.status = { state: 'fetching' }
      return
    case 'fetchError':
      // TODO
      state.store.remote.state = 'error'
      return
  }
})
