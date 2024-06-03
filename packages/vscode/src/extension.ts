import * as vscode from 'vscode'
import { EntityStore } from './models/EntityStore'
import { EntityDefinitionProvider } from './providers/EntityDefinitionProvider'
import { EntityIdHoverProvider } from './providers/EntityIdHoverProvider'
import { EntityIdLinkProvider } from './providers/EntityIdLinkProvider'
import { ExternalLinkProvider } from './providers/ExternalLinkProvider'
import { setupDecorationProvider } from './providers/decorationProvider'

// TODO: can we target these more narrowly? Notebook type?
// Note that we need to match file:// and also vscode-vfs:// schemes to work on github.dev
const selector: vscode.DocumentSelector = {
  // scheme: "file"
  language: 'markdown',
}

export function activate(context: vscode.ExtensionContext) {
  // TODO: handle multiple workspace folders (detect the one(s) that contains
  // the relevant files?)
  const folders = vscode.workspace.workspaceFolders
  const basePath = folders && folders[0]
  if (!basePath) {
    return
  }

  const entities = new EntityStore(basePath.uri.fsPath, vscode.workspace.fs)

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      selector,
      new EntityIdHoverProvider(entities),
    ),
    vscode.languages.registerDefinitionProvider(
      selector,
      new EntityDefinitionProvider(entities),
    ),
    vscode.languages.registerDocumentLinkProvider(
      selector,
      new EntityIdLinkProvider(entities),
    ),
    vscode.languages.registerDocumentLinkProvider(
      selector,
      new ExternalLinkProvider(),
    ),
  )

  setupDecorationProvider(context, entities)
}

export function deactivate() {}
