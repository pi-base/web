import type { Version } from '@pi-base/core'
import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

import { readFile } from './fs.js'

function refName(raw: string) {
  const match = /refs\/heads\/([^\n]+)/.exec(raw)
  return match && match[1]
}

export async function find(root = '.') {
  let version = await fromRepo(root)
  if (version) {
    return version
  }

  version = fromEnv()
  if (version) {
    return version
  }

  throw new Error('Could not determine bundle version')
}

async function fromRepo(root = '.'): Promise<Version | undefined> {
  const contents = await readFile(resolve(root, '.git', 'HEAD')).catch(() => {})
  if (!contents) {
    return
  }

  const head = refName(contents)

  if (head) {
    const { stdout } = await promisify(execFile)('git', ['rev-parse', 'HEAD'], {
      cwd: root,
    })
    return {
      ref: head,
      sha: stdout.trim(),
    }
  }
}

function fromEnv(env: NodeJS.ProcessEnv = process.env): Version | undefined {
  if (!env.GITHUB_REF) {
    return
  }
  if (!env.GITHUB_SHA) {
    return
  }

  return {
    ref: refName(env.GITHUB_REF) || 'unknown',
    sha: env.GITHUB_SHA,
  }
}
