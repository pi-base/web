import * as vscode from 'vscode'
import { BaseEntityProvider } from './BaseEntityProvider'
import { debug } from '../logging'

// Preview the entitiy description when hovering over an entity ID.
export class EntityIdHoverProvider
  extends BaseEntityProvider
  implements vscode.HoverProvider
{
  async provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const entity = await this.entityAtPosition(document, position)
    debug('EntityIdHoverProvider#provideHover', { entity, position })

    if (!entity) {
      return
    }

    const { path, name, description } = entity

    return new vscode.Hover(
      new vscode.MarkdownString(
        [`# [${name}](${path})`, '', description].join('\n'),
      ),
    )
  }
}
