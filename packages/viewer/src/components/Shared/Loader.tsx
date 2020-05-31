import React from 'react'

import { useStore } from '../../models'
import { loaded } from '../../models/Store'

export default React.memo(
  function Loader({ children }: { children: JSX.Element[] }) {
    const store = useStore()

    if (loaded(store)) {
      return <>{children}</>
    } else {
      return <p>Loading ...</p> // TODO
    }
  }
)