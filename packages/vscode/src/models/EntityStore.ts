import * as vscode from 'vscode'
import * as yaml from 'js-yaml'
import { z } from 'zod'
import { propertySchema, spaceSchema } from './schemas'
import {
  Property,
  PropertyId,
  Space,
  SpaceId,
  isPropertyId,
  isSpaceId,
  normalizeId,
} from './types'

type Location = { path: string; uri: vscode.Uri }

export class EntityStore {
  #pageCache: Record<string, string> = {}

  constructor(
    private readonly root: string,
    private readonly fs: vscode.FileSystem,
  ) {}

  memoize(path: string, contents: string) {
    this.#pageCache[path] = contents
  }

  lookup(token: string) {
    try {
      if (isSpaceId(token)) {
        return this.fetch(token)
      } else if (isPropertyId(token)) {
        return this.fetch(token)
      }
    } catch (error) {
      // TODO: improve error handling
      console.error('Failed to lookup', { token, error })
    }
  }

  private async fetch(id: SpaceId): Promise<(Space & Location) | null>
  private async fetch(id: PropertyId): Promise<(Property & Location) | null>
  private async fetch(id: string) {
    switch (id[0]) {
      case 'S':
        return this.load(
          `spaces/${normalizeId(id as SpaceId)}/README.md`,
          spaceSchema,
        )
      case 'P':
        return this.load(
          `properties/${normalizeId(id as PropertyId)}.md`,
          propertySchema,
        )
      default:
        return null
    }
  }

  private async load<T>(path: string, schema: z.ZodSchema<T>) {
    path = `${this.root}/${path}`
    const uri = expandPath(path)
    if (!this.#pageCache[path]) {
      const bytes = await this.fs.readFile(uri)
      this.#pageCache[path] = new TextDecoder().decode(bytes)
    }

    const parsed = parseDocument(schema, this.#pageCache[path])
    if (!parsed) {
      return null
    }
    if (parsed.error) {
      // TODO: handle
      return null
    }

    return { ...parsed.data, path, uri }
  }
}

function expandPath(path: string) {
  // In github.dev, file URIs look like vscode-vfs://github%2B.../pi-base/data/...
  // See also notes in https://code.visualstudio.com/api/extension-guides/web-extensions#migrate-extension-with-code
  // TODO: clean this up / make it less implicit
  const uri = vscode.Uri.file(path)
  const folders = vscode.workspace.workspaceFolders
  if (folders) {
    const root = folders[0].uri
    return uri.with({ authority: root.authority, scheme: root.scheme })
  } else {
    return uri
  }
}

function parseDocument<T>(schema: z.ZodSchema<T>, contents: string) {
  const match = contents.match(
    /^(---)?\s*(?<frontmatter>[\s\S]*?)\s*---(?<body>[\s\S]*)/,
  )
  if (!match?.groups) {
    return
  }

  const { frontmatter, body } = match.groups
  const meta = yaml.load(frontmatter)
  const data = { description: body.trim() }
  // FIXME: validation
  const raw = typeof meta === 'object' ? { ...meta, ...data } : data

  return schema.safeParse(raw)
}
