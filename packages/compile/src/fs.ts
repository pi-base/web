import fs from 'node:fs/promises'
import util from 'util'
import grob from 'glob'

const glob = util.promisify(grob)

export async function readFile(path: string) {
  const buffer = await fs.readFile(path)
  return buffer.toString()
}

export type File = {
  path: string
  contents: string
}

export async function readFiles(pattern: string): Promise<File[]> {
  const items = await glob(pattern)
  return Promise.all(
    items.map(async function read(path: string) {
      const contents = await readFile(path)
      return { path, contents: contents.toString() }
    }),
  )
}
