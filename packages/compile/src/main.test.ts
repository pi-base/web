import { beforeEach, afterAll, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { readFile, rm, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const main = join(__dirname, '..', 'src', 'main.ts')
const repo = join(__dirname, '..', 'test', 'repo')
const out = 'out.json'

async function run(dir: string) {
  const { stdout, stderr, error, status } = spawnSync(
    'tsx',
    [main, join(repo, dir), out],
    {
      env: {
        GITHUB_REF: 'refs/heads/test',
        GITHUB_SHA: 'c74d99cf46f6ed23e742f2617e9908294b4a608b',
        PATH: process.env.PATH,
      },
    },
  )

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
  await rm(join(repo, 'valid', 'artifacts'), { recursive: true, force: true })
}

async function readJson(path: string) {
  return JSON.parse((await readFile(path)).toString())
}

beforeEach(cleanup)
afterAll(cleanup)

it('builds a bundle', async () => {
  const { output, error } = await run('valid')
  expect(output).toContain(`::debug Compiling repo=${repo}/valid to out=`)
  expect(error).toBe(false)

  const bundle = await readJson(`${repo}/valid/${out}`)

  expect(bundle.properties.length).toEqual(3)
  expect(bundle.spaces.length).toEqual(2)
  expect(bundle.theorems.length).toEqual(1)
  expect(bundle.traits.length).toEqual(3)
})

it('emits the derived-data artifact set', async () => {
  const { error } = await run('valid')
  expect(error).toBe(false)

  const dir = join(repo, 'valid', 'artifacts')

  const manifest = await readJson(join(dir, 'manifest.json'))
  expect(manifest.format).toEqual(1)
  expect(manifest.version.sha).toEqual(
    'c74d99cf46f6ed23e742f2617e9908294b4a608b',
  )

  const core = await readJson(join(dir, manifest.paths.core))
  expect(core.properties.length).toEqual(3)
  expect(core.spaces.length).toEqual(2)
  expect(core.theorems.length).toEqual(1)
  expect(core.traits).toEqual([
    { space: 'S000001', property: 'P000016', value: true },
    { space: 'S000001', property: 'P000036', value: false },
    { space: 'S000002', property: 'P000036', value: false },
  ])

  const text = await readJson(join(dir, manifest.paths.text))
  expect(text.properties.length).toEqual(3)
  expect(text.properties.every((p: any) => p.description.length > 0)).toBe(true)

  const shard = await readJson(
    join(dir, manifest.paths.spaces.replace('{id}', 'S000001')),
  )
  expect(shard.traits).toEqual([
    {
      property: 'P000019',
      value: true,
      proof: { theorems: ['T000001'], properties: ['P000016'] },
    },
  ])

  const empty = await readJson(
    join(dir, manifest.paths.spaces.replace('{id}', 'S000002')),
  )
  expect(empty.traits).toEqual([])
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
