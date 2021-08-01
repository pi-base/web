import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const main = path.join(__dirname, '..', 'lib', 'main.js')
const repo = path.join(__dirname, '__tests__', 'repo')
const out = path.join(repo, 'out.json')

// Note: this runs lib/main.js, which it expects to be compiled and current
// You may need to manually run `yarn build`
function run(dir: string): { output: string; error: boolean } {
  try {
    const output = cp
      .execSync(`node ${main}`, {
        env: {
          GITHUB_REF: 'refs/heads/test',
          GITHUB_SHA: 'c74d99cf46f6ed23e742f2617e9908294b4a608b',
          GITHUB_WORKSPACE: path.join(repo, dir),
          INPUT_OUT: out,
        },
      })
      .toString()

    return { output, error: false }
  } catch (e: unknown) {
    return {
      // FIXME
      // output: `${e.stdout.toString()}\n${e.stderr.toString()}`,
      output: 'Error',
      error: true,
    }
  }
}

function cleanup() {
  if (fs.existsSync(out)) {
    fs.unlinkSync(out)
  }
}

beforeEach(cleanup)
afterAll(cleanup)

it('builds a bundle', () => {
  run('valid')

  // FIXME - parse using Bundle schema
  /* eslint-disable */
  const bundle = JSON.parse(fs.readFileSync(out).toString())

  expect(bundle.properties).toHaveLength(3)
  expect(bundle.spaces).toHaveLength(2)
  expect(bundle.theorems).toHaveLength(1)
  expect(bundle.traits).toHaveLength(3)
  /* eslint-enable */
})

it('writes error messages for invalid bundles', () => {
  const { output, error } = run('invalid')

  expect(error).toEqual(true)
  expect(fs.existsSync(out)).toEqual(false)
  expect(output).toContain(
    '::error file=theorems/T000001.md::if references unknown property=P100016',
  )
})
