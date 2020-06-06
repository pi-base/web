import React from 'react'
import produce from 'immer'

import { check } from '@pi-base/core'

import { Action } from './actions'
import { Store, theoremIndex } from './models/Store/state'

export { initial } from './models/Store/state'

export type Dispatch = React.Dispatch<Action>
export type Reducer = React.Reducer<Store, Action>

export const reducer: Reducer = produce((state: Store, action: Action) => {
  switch (action.action) {
    case 'loaded':
      Object.assign(state, action.value)
      return

    case 'fetch.started':
      state.remote.branch = action.branch
      state.remote.host = action.host
      state.remote.state = 'fetching'
      return

    case 'fetch.error':
      state.error = action.error.message
      return

    case 'check':
      if (state.checked.has(action.space.uid)) { return }

      const result = check(
        state.bundle,
        action.space,
        theoremIndex(state)
      )

      switch (result.kind) {
        case 'bundle':
          state.bundle = result.bundle
          state.checked.add(action.space.uid)
          return
      }
      return
  }
})
