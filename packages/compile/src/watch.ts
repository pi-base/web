#!/usr/bin/env node

import chalk from 'chalk'

import load from './load'
import listen from './watch/listen'
import { boot } from './watch/server'

const port = 3141
const root = process.cwd()

const log = console.log.bind(console)

const { setState } = boot({ log, port })

async function build() {
  try {
    const { bundle, errors } = await load('.')

    if (!bundle) {
      log(chalk.red('Build failed'))
    } else if (errors) {
      log(chalk.yellow('Build finished with errors'))
    } else {
      log(chalk.green('Build finished'))
    }

    if (errors) {
      log('')
      errors.forEach((messages, path) => {
        log(chalk.yellow(path))
        messages.forEach(message => log(`* ${message}`))
        log('')
      })
    }

    setState({ bundle, errors })
  } catch (e) {
    log(chalk.red('Error'), e.message)
  }
}

log(`Watching ${chalk.cyan(root)} for changes.`)
log(`Press ${chalk.cyan('CTRL-C')} to exit.`)

listen(root, (path: string) => {
  log(`${chalk.cyan(path)} changed. Re-compiling.`)
  build()
})

build()
