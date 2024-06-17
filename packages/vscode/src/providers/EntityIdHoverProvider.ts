import * as vscode from 'vscode'
import { BaseEntityProvider } from './BaseEntityProvider'
import { EntityPreviewPresenter } from '../presenters/EntityPreviewPresenter'

// Preview the entitiy description when hovering over an entity ID.
export class EntityIdHoverProvider
  extends BaseEntityProvider
  implements vscode.HoverProvider
{
  async provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const entity = await this.entityAtPosition(document, position)
    this.telemetry.trace('EntityIdHoverProvider#provideHover', {
      path: document.fileName,
      position,
      entity,
    })

    if (!entity) {
      return
    }

    const presenter = new EntityPreviewPresenter(this.telemetry)
    const markdown = await presenter.render(entity)
    return new vscode.Hover(markdown)
  }
}
