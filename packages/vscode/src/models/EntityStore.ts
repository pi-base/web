import * as vscode from 'vscode'
import * as z from 'zod'
import {
  SpacePage,
  PropertyPage,
  Id,
  schemas,
  parseDocument,
} from '@pi-base/core'
import { Telemetry } from '../providers/Telemetry'
import { Files } from './Files'

type FetchResult<T> = Promise<(T & { uri: vscode.Uri }) | null>

// Repository for file-backed entities
export class EntityStore {
  constructor(
    private readonly files: Files,
    private readonly telemetry: Telemetry,
  ) {}

  memoize(path: string, contents: string) {
    this.files.set(path, contents)
  }

  lookup(id: string) {
    try {
      if (Id.isSpaceId(id)) {
        return this.fetch(id)
      } else if (Id.isPropertyId(id)) {
        return this.fetch(id)
      }
    } catch (error) {
      this.telemetry.entityLookupFailed(id, error)
    }
  }

  private async fetch(id: Id.SId): FetchResult<SpacePage>
  private async fetch(id: Id.PId): FetchResult<PropertyPage>
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
    const { contents, uri } = await this.files.read(path)

    const parsed = parseDocument(schema, contents)
    if (!parsed || parsed.error) {
      this.telemetry.fileParseFailed({
        path,
        contents,
        error: parsed?.error.errors,
      })
      return null
    }

    return { ...parsed.data, uri }
  }
}
