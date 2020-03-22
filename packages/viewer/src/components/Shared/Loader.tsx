import React from 'react'

import { useStore } from '../../hooks'

export default React.memo(
  function Loader({ children }: { children: JSX.Element[] }) {
    const store = useStore()

    if (store.spaces.size > 0) {
      return <>{children}</>
    } else {
      return <p>Loading ...</p> // TODO
    }
  }
)