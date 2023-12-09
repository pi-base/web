import { beforeEach, afterAll, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { readFile, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const main = join(__dirname, '..', 'src', 'main.ts')
const repo = join(__dirname, '..', 'test', 'repo')
const out = join(repo, 'out.json')

async function run(dir: string) {
  const { stdout, stderr, error, status } = spawnSync('tsx', [main], {
    env: {
      GITHUB_REF: 'refs/heads/test',
      GITHUB_SHA: 'c74d99cf46f6ed23e742f2617e9908294b4a608b',
      GITHUB_WORKSPACE: join(repo, dir),
      INPUT_OUT: out,
      PATH: process.env.PATH,
    },
  })

  if (error) {
    throw error
  }

  if (status !== 0) {
    return {
      output: `${stdout}\n${stderr}`,
      error: true,
    }
  }

  return { output: stdout.toString(), error: false }
}

async function cleanup() {
  if (await exists(out)) {
    await unlink(out)
  }
}

beforeEach(cleanup)
afterAll(cleanup)

it('builds a bundle', async () => {
  const { output, error } = await run('valid')
  expect(output).toContain(
    `::debug::Compiling repo=${repo}/valid to out=${out}`,
  )
  expect(error).toBe(false)

  const bundle = JSON.parse((await readFile(out)).toString())

  expect(bundle.properties.length).toEqual(3)
  expect(bundle.spaces.length).toEqual(2)
  expect(bundle.theorems.length).toEqual(1)
  expect(bundle.traits.length).toEqual(3)
})

it('writes error messages for invalid bundles', async () => {
  const { output, error } = await run('invalid')

  expect(error).toEqual(true)
  expect(await exists(out)).toEqual(false)
  expect(output).toContain(
    '::error file=theorems/T000001.md::if references unknown property=P100016',
  )
})

async function exists(path: string) {
  try {
    await stat(path)
    return true
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return false
    }
    throw e
  }
}
