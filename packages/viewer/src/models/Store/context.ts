import { createContext, useContext } from 'react'

import { Store, initial } from './state'

const StoreContext = createContext<Store>(initial)
export const Provider = StoreContext.Provider

export function useStore() {
  const store = useContext(StoreContext)
  if (store === null) { throw new Error('Store cannot be null, please add a context provider') }
  return store
}
