import * as vscode from 'vscode'
import { BaseEntityProvider, matchingRanges } from './BaseEntityProvider'
import { Id } from '@pi-base/core'
import { debug } from '../logging'

// Link entity IDs to their defining files.
export class EntityIdLinkProvider
  extends BaseEntityProvider
  implements vscode.DocumentLinkProvider
{
  async provideDocumentLinks(document: vscode.TextDocument) {
    const ranges = matchingRanges(document, Id.idExp)

    const links: vscode.DocumentLink[] = []
    for (const [range, match] of ranges) {
      const id = match[0]
      const entity = await this.entities.lookup(id)
      if (!entity) {
        continue
      }

      links.push({
        range,
        target: entity.uri,
        tooltip: `View ${entity.name}`,
      })
    }
    return links
  }
}
