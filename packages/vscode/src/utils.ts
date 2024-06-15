import { Uri } from 'vscode'

export function openUriLink(uri: Uri) {
  // Hover text only supports an allow list of schemes (https://github.com/microsoft/vscode/issues/153277), which
  // doesn't include the `vscode-vfs` scheme used by github.dev, so we instead use a command link to open the file.
  //
  // See also
  // - https://code.visualstudio.com/api/extension-guides/command
  // - https://code.visualstudio.com/api/references/commands
  return commandLink('vscode.open', [uri])
}

function commandLink(name: string, args: any[]) {
  return `command:${name}?${encodeURIComponent(JSON.stringify(args))}`
}
