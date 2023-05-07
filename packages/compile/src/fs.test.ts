import { describe, expect, it } from 'vitest'
import path from 'path'

import { readFile, readFiles } from './fs.js'

describe('readFile', () => {
  it('resolves to the file contents', async () => {
    const contents = await readFile(__filename)
    expect(contents).toContain('Fblthp')
  })

  it('errors if not found', async () => {
    let error = undefined

    try {
      await readFile(__filename + '/not_a_file.ts')
    } catch (e) {
      error = e
    }

    expect(error).not.toBeUndefined()
  })
})

describe('readFiles', () => {
  it('resolves to the file contents', async () => {
    const contents = await readFiles(path.join(__dirname, '**', '*.test.ts'))

    const file = contents.find(file => file.path == __filename)
    expect(file!.contents).toContain('Zndrsplt')
  })

  it('resolves to the file contents', async () => {
    const contents = await readFiles(path.join(__dirname, '**', '*.test.xyz'))

    expect(contents).toEqual([])
  })
})
