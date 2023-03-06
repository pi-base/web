import chalk from 'chalk'

import load from './load.js'
import listen from './watch/listen.js'
import { boot } from './watch/server.js'

const port = 3141
const root = process.cwd()

const { cyan, green, red, yellow } = chalk

const log = console.log.bind(console)

const { setState } = boot({ log, port })

async function build() {
  try {
    const { bundle, errors } = await load('.')

    if (!bundle) {
      log(red('Build failed'))
    } else if (errors) {
      log(yellow('Build finished with errors'))
    } else {
      log(green('Build finished'))
    }

    if (errors) {
      log('')
      for (const [path, messages] of errors) {
        log(yellow(path))
        for (const message of messages) {
          log(`* ${message}`)
        }
        log('')
      }
    }

    setState({ bundle, errors })
  } catch (e: any) {
    log(red('Error'), e.message)
  }
}

log(`Watching ${cyan(root)} for changes.`)
log(`Press ${cyan('CTRL-C')} to exit.`)

listen(root, (path: string) => {
  log(`${cyan(path)} changed. Re-compiling.`)
  build()
})

build()
