import * as vscode from 'vscode'
import { Id } from '@pi-base/core'
import { EntityStore } from '../models/EntityStore'
import { matchingRanges } from './BaseEntityProvider'
import { Telemetry } from './Telemetry'

const decorationType = vscode.window.createTextEditorDecorationType({
  after: {
    color: 'rgba(153, 153, 122, 0.7)',
    margin: '0 0 0 1em',
  },
})

export function setupDecorationProvider(
  context: vscode.ExtensionContext,
  entities: EntityStore,
  telemetry: Telemetry,
) {
  let activeEditor = vscode.window.activeTextEditor

  // Trigger an initial update
  if (activeEditor) {
    triggerUpdateDecorations(activeEditor, entities, telemetry)
  }

  // Update the decorations when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      activeEditor = editor
      if (editor) {
        triggerUpdateDecorations(editor, entities, telemetry)
      }
    },
    null,
    context.subscriptions,
  )

  // On document change, update both the decorations and the contents of the
  // EntityStore corresponding to that document.
  vscode.workspace.onDidChangeTextDocument(
    event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(activeEditor, entities, telemetry)
      }

      entities.memoize(event.document.uri.fsPath, event.document.getText())
    },
    null,
    context.subscriptions,
  )
}

async function triggerUpdateDecorations(
  { document, setDecorations }: vscode.TextEditor,
  entities: EntityStore,
  telemetry: Telemetry,
) {
  telemetry.trace('triggerUpdateDecorations', { path: document.fileName })
  const ranges = matchingRanges(document, Id.idExp)

  const decorations: vscode.DecorationOptions[] = []
  for (const [range, match] of ranges) {
    const entity = await entities.lookup(match[0])
    if (!entity) {
      continue
    }

    decorations.push({
      range,
      renderOptions: {
        after: {
          contentText: `(${entity.name})`,
        },
      },
    })
  }

  setDecorations(decorationType, decorations)
}
