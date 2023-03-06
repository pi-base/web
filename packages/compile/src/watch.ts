/**
 * Watch DATA_WORKSPACE (../data) for changes, (re)build an serve a data bundle
 * locally at PORT (3141).
 *
 * Intended for running locally while iterating on changes in the data repo.
 */
import chalk from 'chalk'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import load from './load.js'
import listen from './watch/listen.js'
import { boot } from './watch/server.js'

const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '..', '..', '..')
const data = process.env.DATA_WORKSPACE || resolve(root, '.data')

const port = Number(process.env.PORT || '3141')

const { cyan, green, red, yellow } = chalk

const log = console.log.bind(console)

const { setState } = boot({ log, port })

async function build() {
  try {
    const { bundle, errors } = await load(data)

    if (!bundle) {
      log(red('Build failed'))
    } else if (errors) {
      log(yellow('Build finished with errors'))
    } else {
      log(green('Build finished'))
    }

    if (errors) {
      log()
      for (const [path, messages] of errors) {
        log(yellow(path))
        for (const message of messages) {
          log(`* ${message}`)
        }
        log()
      }
    }

    setState({ bundle, errors })
  } catch (e: any) {
    log(red('Error'), e.message)
  }
}

log(`Watching ${cyan(data)} for changes.`)
log(`Press ${cyan('CTRL-C')} to exit.`)

listen(data, (path: string) => {
  log(`${cyan(path)} changed. Re-compiling.`)
  build()
})

build()
