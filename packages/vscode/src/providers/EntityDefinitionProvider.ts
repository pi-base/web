import * as vscode from 'vscode'
import { BaseEntityProvider } from './BaseEntityProvider'
import { debug } from '../logging'

// Support go-to-definition for entity IDs.
//
// TODO: also implement a reference provider?
export class EntityDefinitionProvider
  extends BaseEntityProvider
  implements vscode.DefinitionProvider
{
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const entity = await this.entityAtPosition(document, position)
    debug('EntityDefinitionProvider#provideDefinition', { entity, position })

    if (!entity) {
      return
    }

    return new vscode.Location(entity.uri, new vscode.Position(0, 0))
  }
}
