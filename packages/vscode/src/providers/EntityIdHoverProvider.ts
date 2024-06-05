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

    const { uri, name, description } = entity

    // Hover text only supports an allow list of schemes (https://github.com/microsoft/vscode/issues/153277), which
    // doesn't include the `vscode-vfs` scheme used by github.dev, so we instead use a command link to open the file.
    //
    // See also
    // - https://code.visualstudio.com/api/extension-guides/command
    // - https://code.visualstudio.com/api/references/commands
    const openCommand = `command:vscode.open?${encodeURIComponent(
      JSON.stringify([uri]),
    )}`
    const nameLink = new vscode.MarkdownString(`# [${name}](${openCommand})`)
    nameLink.isTrusted = true

    return new vscode.Hover([
      nameLink,
      new vscode.MarkdownString(`\n\n${description}`),
    ])
  }
}
