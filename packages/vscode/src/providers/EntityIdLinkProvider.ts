import * as vscode from 'vscode'
import { BaseEntityProvider, matchingRanges } from './BaseEntityProvider'
import { idExp } from '../models/types'
import { debug } from '../models/logging'

export class EntityIdLinkProvider
  extends BaseEntityProvider
  implements vscode.DocumentLinkProvider
{
  async provideDocumentLinks(document: vscode.TextDocument) {
    debug('EntityIdLinkProvider#provideDocumentLinks')

    const ranges = matchingRanges(document, idExp)

    const links: vscode.DocumentLink[] = []
    for (const [range, match] of ranges) {
      const id = match[0]
      const entity = await this.entities.lookup(id)
      if (!entity) {
        return
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
