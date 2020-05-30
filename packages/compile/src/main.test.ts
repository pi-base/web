import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const main = path.join(__dirname, '..', 'lib', 'main.js')
const repo = path.join(__dirname, '__tests__', 'repo')
const out = path.join(repo, 'out.json')

// Note: this runs lib/main.js, which it expects to be compiled and current
// You may need to manually run `yarn build`
function run(dir: string): { output: string, error: boolean } {
  try {
    const output = cp.execSync(
      `node ${main}`,
      {
        env: {
          'GITHUB_WORKSPACE': path.join(repo, dir),
          'INPUT_OUT': out
        }
      }
    ).toString()

    return { output, error: false }
  } catch (e) {
    return {
      output: `${e.stdout.toString()}\n${e.stderr.toString()}`,
      error: true
    }
  }
}

function cleanup() {
  if (fs.existsSync(out)) { fs.unlinkSync(out) }
}

beforeEach(cleanup)
afterAll(cleanup)

it('builds a bundle', () => {
  run('valid')

  const bundle = JSON.parse(fs.readFileSync(out).toString())

  expect(bundle.properties.length).toEqual(3)
  expect(bundle.spaces.length).toEqual(2)
  expect(bundle.theorems.length).toEqual(1)
  expect(bundle.traits.length).toEqual(3)
})

it('writes error messages for invalid bundles', () => {
  const { output, error } = run('invalid')

  expect(error).toEqual(true)
  expect(fs.existsSync(out)).toEqual(false)
  expect(output).toContain('::error::file=theorems/T000001.md::if references unknown property=P100016')
})
