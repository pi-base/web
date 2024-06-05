import * as vscode from 'vscode'
import { EntityStore } from './models/EntityStore'
import { EntityDefinitionProvider } from './providers/EntityDefinitionProvider'
import { EntityIdHoverProvider } from './providers/EntityIdHoverProvider'
import { EntityIdLinkProvider } from './providers/EntityIdLinkProvider'
import { ExternalLinkProvider } from './providers/ExternalLinkProvider'
import { setupDecorationProvider } from './providers/decorationProvider'
import debug from 'debug'

export function activate(context: vscode.ExtensionContext) {
  findRootFolder().then(uri => {
    if (uri) {
      try {
        debug('Initializing π-base extension')
        setup(context, uri)
      } catch (error) {
        console.error('Failed to initialize π-base extension', error)
      }
    } else {
      console.log(
        'No data folder found in workspace. Skipping π-base initialization.',
      )
    }
  })
}

export function deactivate() {}

// TODO: can we target these more narrowly? Notebook type?
// Note that we need to match file:// and also vscode-vfs:// schemes to work on github.dev
const selector: vscode.DocumentSelector = {
  // scheme: "file"
  language: 'markdown',
}

function setup(context: vscode.ExtensionContext, baseUri: vscode.Uri) {
  const entities = new EntityStore(baseUri, vscode.workspace.fs)

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

async function findRootFolder() {
  const expected = ['spaces', 'properties', 'theorems']

  for (const folder of vscode.workspace.workspaceFolders || []) {
    const files = await vscode.workspace.fs.readDirectory(folder.uri)
    const names = files.map(([name, _]) => name)
    if (expected.every(name => names.includes(name))) {
      return folder.uri
    }
  }
}
