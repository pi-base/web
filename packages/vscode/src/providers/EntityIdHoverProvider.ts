import * as vscode from 'vscode'
import { BaseEntityProvider } from './BaseEntityProvider'
import { debug } from '../models/logging'

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

    const markdown = new vscode.MarkdownString()
    markdown.appendMarkdown(
      [`# [${name}](${path})`, '', description].join('\n'),
    )

    return new vscode.Hover(markdown)
  }
}
