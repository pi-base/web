import * as core from '@actions/core'
import * as fs from 'fs'
import * as process from 'process'

import * as Bundle from './Bundle'
import { property, parse, space, theorem, trait } from './parse'

export async function load(
  repo: string
): Promise<Bundle.Bundle | Bundle.BuildError> {
  const properties = await parse(`${repo}/properties/*.md`, property)
  const spaces = await parse(`${repo}/spaces/**/README.md`, space)
  const theorems = await parse(`${repo}/theorems/*.md`, theorem)
  const traits = await parse(`${repo}/spaces/**/properties/*.md`, trait)

  return Bundle.build(properties, spaces, theorems, traits)
}

async function run(): Promise<void> {
  const repo: string = process.env['GITHUB_WORKSPACE'] || '.'
  const outpath: string = core.getInput('out')

  core.debug(`Compiling repo=${repo} to out=${outpath}`)

  const bundle = await load(repo)
  fs.writeFileSync(outpath, JSON.stringify(bundle.asJSON(), null, 2))
}

run().catch(err => core.setFailed(err.message))
