import React from 'react'

import produce from 'immer'

import { Action } from './actions'
import { Store } from './models/Store/state'
import * as S from './models/Store/state'

export { initial } from './models/Store/state'

export type Dispatch = React.Dispatch<Action>
export type Reducer = React.Reducer<Store, Action>

export const reducer: Reducer = produce((state: Store, action: Action) => {
  switch (action.action) {
    case 'loaded':
      Object.assign(state, action.value)
      return
    case 'check':
      S.check(state, action.space)
      return
    case 'fetch.started':
      state.remote.branch = action.branch
      state.remote.host = action.host
      state.remote.state = 'fetching'
      return
    case 'fetch.error':
      state.remote.state = 'error'
      return
  }
})
