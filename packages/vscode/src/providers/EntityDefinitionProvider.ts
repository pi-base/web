import * as vscode from 'vscode'
import { BaseEntityProvider } from './BaseEntityProvider'

// Support go-to-definition for entity IDs.
export class EntityDefinitionProvider
  extends BaseEntityProvider
  implements vscode.DefinitionProvider
{
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const entity = await this.entityAtPosition(document, position)
    this.telemetry.trace('EntityDefinitionProvider#provideDefinition', {
      path: document.fileName,
      position,
      entity,
    })

    if (!entity) {
      return
    }

    return new vscode.Location(entity.uri, new vscode.Position(0, 0))
  }
}
