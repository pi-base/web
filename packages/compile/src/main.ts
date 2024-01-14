import * as fs from 'fs'
import * as process from 'process'
import { bundle as B } from '@pi-base/core'

import load from './load.js'

async function run(repo = '.', out = 'bundle.json'): Promise<void> {
  log(`Compiling repo=${repo} to out=${out}`, 'debug')

  const { bundle, errors } = await load(repo)

  if (errors) {
    errors.forEach((messages, path) => {
      messages.forEach(message => {
        log(`file=${path}::${message}`, 'error')
      })
    })
  }

  if (errors || !bundle) {
    log('Compilation finished with errors', 'error')
    process.exit(1)
  }

  fs.writeFileSync(`${repo}/${out}`, JSON.stringify(B.serialize(bundle)))
}

type Level = 'debug' | 'info' | 'error'

function log(message: string, level: Level = 'info') {
  console.log(`::${level} ${message}`)
}

function fail(message: string) {
  log(message, 'error')
  process.exit(1)
}

run(...process.argv.slice(2)).catch(err => fail(err.message))
