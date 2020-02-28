import path from 'path'

import { readFile, readFiles } from './fs'

describe('readFile', () => {
  test('resolves to the file contents', async () => {
    const contents = await readFile(__filename)
    expect(contents).toContain('Fblthp')
  })

  test('errors if not found', async () => {
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
  test('resolves to the file contents', async () => {
    const contents = await readFiles(path.join(__dirname, '**', '*.test.ts'))

    const file = contents.find(file => file.path == __filename)
    expect(file!.contents).toContain('Zndrsplt')
  })

  test('resolves to the file contents', async () => {
    const contents = await readFiles(path.join(__dirname, '**', '*.test.xyz'))

    expect(contents).toEqual([])
  })
})
