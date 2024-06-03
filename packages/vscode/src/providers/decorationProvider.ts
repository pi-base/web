import * as vscode from 'vscode'
import { idExp } from '../models/types'
import { EntityStore } from '../models/EntityStore'
import { matchingRanges } from './BaseEntityProvider'

const decorationType = vscode.window.createTextEditorDecorationType({
  after: {
    color: 'rgba(153, 153, 122, 0.7)',
    margin: '0 0 0 1em',
  },
})

export function setupDecorationProvider(
  context: vscode.ExtensionContext,
  entities: EntityStore,
) {
  let activeEditor = vscode.window.activeTextEditor
  if (activeEditor) {
    triggerUpdateDecorations(activeEditor, entities)
  }

  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      activeEditor = editor
      if (editor) {
        triggerUpdateDecorations(editor, entities)
      }
    },
    null,
    context.subscriptions,
  )

  vscode.workspace.onDidChangeTextDocument(
    event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(activeEditor, entities)
      }

      entities.memoize(event.document.uri.fsPath, event.document.getText())
    },
    null,
    context.subscriptions,
  )
}

async function triggerUpdateDecorations(
  editor: vscode.TextEditor,
  entities: EntityStore,
) {
  const ranges = matchingRanges(editor.document, idExp)

  const decorations: vscode.DecorationOptions[] = []
  for (const [range, match] of ranges) {
    const entity = await entities.lookup(match[0])
    if (!entity) {
      return
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

  editor.setDecorations(decorationType, decorations)
}
