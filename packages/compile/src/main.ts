import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
import { artifacts as A, bundle as B } from '@pi-base/core'

import load from './load.js'

async function run(
  repo = '.',
  out = 'bundle.json',
  artifactsOut = 'artifacts',
): Promise<void> {
  log(`Compiling repo=${repo} to out=${out} artifacts=${artifactsOut}`, 'debug')

  const { bundle, deductions, errors } = await load(repo)

  if (errors) {
    errors.forEach((messages, path) => {
      messages.forEach(message => {
        log(`file=${path}::${message}`, 'error')
      })
    })
  }

  if (errors || !bundle || !deductions) {
    log('Compilation finished with errors', 'error')
    process.exit(1)
  }

  fs.writeFileSync(`${repo}/${out}`, JSON.stringify(B.serialize(bundle)))
  writeArtifacts(`${repo}/${artifactsOut}`, A.serialize(bundle, deductions))
}

function writeArtifacts(dir: string, artifacts: A.Artifacts): void {
  const write = (relative: string, data: unknown) => {
    const file = path.join(dir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(data))
  }

  const { manifest, core, text, spaces } = artifacts

  write('manifest.json', manifest)
  write(manifest.paths.core, core)
  write(manifest.paths.text, text)
  spaces.forEach((artifact, space) => {
    write(A.spacePath(manifest, space), artifact)
  })
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
