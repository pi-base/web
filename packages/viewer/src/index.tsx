import React from 'react'
import ReactDOM from 'react-dom'
import { enableMapSet } from 'immer'

import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import * as Error from './errors'
import * as serviceWorker from './serviceWorker'

enableMapSet()

const errorHandler: Error.Handler =
  process.env.NODE_ENV === 'production'
    ? Error.sentry('https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960')
    : Error.log()

ReactDOM.render(<App errorHandler={errorHandler} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
