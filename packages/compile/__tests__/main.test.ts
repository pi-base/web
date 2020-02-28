import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

test('test runs', () => {
  const main = path.join(__dirname, '..', 'lib', 'main.js')
  const repo = path.join(__dirname, 'repo')
  const out = path.join(__dirname, 'repo', 'out.json')

  fs.unlinkSync(out)

  process.env['INPUT_REPO'] = repo
  process.env['INPUT_OUT'] = out

  console.log(cp.execSync(`node ${main}`, {env: process.env}).toString())

  const bundle = JSON.parse(fs.readFileSync(out).toString())

  expect(bundle.properties.length).toEqual(3)
  expect(bundle.spaces.length).toEqual(2)
  expect(bundle.theorems.length).toEqual(1)
  expect(bundle.traits.length).toEqual(3)
})
