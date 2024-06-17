import * as vscode from 'vscode'
import { EntityStore } from './models/EntityStore'
import { EntityDefinitionProvider } from './providers/EntityDefinitionProvider'
import { EntityIdHoverProvider } from './providers/EntityIdHoverProvider'
import { EntityIdLinkProvider } from './providers/EntityIdLinkProvider'
import { ExternalLinkProvider } from './providers/ExternalLinkProvider'
import { setupDecorationProvider } from './providers/decorationProvider'
import { Telemetry } from './providers/Telemetry'
import { Files } from './models/Files'

export function activate(context: vscode.ExtensionContext) {
  const telemetry = new Telemetry(vscode.window)

  findRootFolder(vscode.workspace).then(uri => {
    if (!uri) {
      telemetry.activationSkipped()
      return
    }

    try {
      telemetry.activating()
      setup(context, telemetry, uri)
      telemetry.activated()
    } catch (error) {
      telemetry.activationFailed(error)
    }
  })
}

export function deactivate() {}

const selector: vscode.DocumentSelector = [
  { scheme: 'file', language: 'markdown' },
  { scheme: 'vscode-vfs', language: 'markdown' }, // Used on github.dev
]

function setup(
  context: vscode.ExtensionContext,
  telemetry: Telemetry,
  baseUri: vscode.Uri,
) {
  const entities = new EntityStore(
    new Files(baseUri, vscode.workspace.fs),
    telemetry,
  )

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      selector,
      new EntityIdHoverProvider(entities, telemetry),
    ),
    vscode.languages.registerDefinitionProvider(
      selector,
      new EntityDefinitionProvider(entities, telemetry),
    ),
    vscode.languages.registerDocumentLinkProvider(
      selector,
      new EntityIdLinkProvider(entities, telemetry),
    ),
    vscode.languages.registerDocumentLinkProvider(
      selector,
      new ExternalLinkProvider(telemetry),
    ),
  )

  setupDecorationProvider(context, entities, telemetry)
}

async function findRootFolder({
  fs,
  workspaceFolders = [],
}: typeof vscode.workspace) {
  const expected = ['spaces', 'properties', 'theorems']

  for (const folder of workspaceFolders) {
    const files = await fs.readDirectory(folder.uri)
    const names = files.map(([name, _]) => name)
    if (expected.every(name => names.includes(name))) {
      return folder.uri
    }
  }
}
