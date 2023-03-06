/**
 * Entry point for running as a Github action, with the local workspace
 * containing the data repository. Set GITHUB_WORKSPACE to use a different
 * data repository.
 */
import * as core from '@actions/core'
import * as fs from 'fs'
import * as process from 'process'
import { bundle as B } from '@pi-base/core'

import load from './load.js'

async function run(): Promise<void> {
  const repo: string = process.env.GITHUB_WORKSPACE || '.'
  const outpath: string = core.getInput('out')

  core.debug(`Compiling repo=${repo} to out=${outpath}`)

  const { bundle, errors } = await load(repo)

  if (errors) {
    errors.forEach((messages, path) => {
      messages.forEach((message) => {
        error(path, message)
      })
    })
  }

  if (errors || !bundle) {
    core.setFailed('Compilation finished with errors')
    return
  }

  fs.writeFileSync(outpath, JSON.stringify(B.serialize(bundle)))
}

function error(file: string, message: string) {
  console.log(`::error file=${file}::${message}`)
}

run().catch((err) => {
  core.setFailed(err.message)
  core.error(err.message)
})
