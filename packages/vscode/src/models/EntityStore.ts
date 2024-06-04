import * as vscode from 'vscode'
import * as yaml from 'js-yaml'
import { z } from 'zod'
import { SpacePage, PropertyPage, Id, schemas } from '@pi-base/core'

type Location = { path: string; uri: vscode.Uri }

// Repository for filesystem-backed entities (spaces, properties, etc.)
export class EntityStore {
  #pageCache: Record<string, string> = {}

  constructor(
    private readonly root: vscode.Uri,
    private readonly fs: vscode.FileSystem,
  ) {}

  memoize(path: string, contents: string) {
    this.#pageCache[path] = contents
  }

  lookup(token: string) {
    try {
      if (Id.isSpaceId(token)) {
        return this.fetch(token)
      } else if (Id.isPropertyId(token)) {
        return this.fetch(token)
      }
    } catch (error) {
      // TODO: improve error handling
      console.error('Failed to lookup', { token, error })
    }
  }

  private async fetch(id: Id.SId): Promise<(SpacePage & Location) | null>
  private async fetch(id: Id.PId): Promise<(PropertyPage & Location) | null>
  private async fetch(id: string) {
    switch (id[0]) {
      case 'S':
        return this.load<SpacePage>(
          `spaces/${Id.normalizeId(id as Id.SId)}/README.md`,
          schemas.spacePage,
        )
      case 'P':
        return this.load<PropertyPage>(
          `properties/${Id.normalizeId(id as Id.PId)}.md`,
          schemas.propertyPage,
        )
      default:
        return null
    }
  }

  private async load<T>(path: string, schema: z.ZodSchema<T>) {
    path = `${this.root.path}/${path}`
    const uri = this.expandPath(path)

    if (!this.#pageCache[path]) {
      const bytes = await this.fs.readFile(uri)
      this.#pageCache[path] = new TextDecoder().decode(bytes)
    }

    const parsed = parseDocument(schema, this.#pageCache[path])
    if (!parsed || parsed.error) {
      console.error('Failed to parse', {
        path,
        contents: this.#pageCache[path],
        error: parsed?.error.errors,
      })
      // TODO: handle
      return null
    }

    return { ...parsed.data, path, uri }
  }

  private expandPath(path: string) {
    // In github.dev, file URIs look like vscode-vfs://github%2B.../pi-base/data/...
    // See also notes in https://code.visualstudio.com/api/extension-guides/web-extensions#migrate-extension-with-code
    // TODO: clean this up / make it less implicit
    const { authority, scheme } = this.root
    return vscode.Uri.file(path).with({ scheme, authority })
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
