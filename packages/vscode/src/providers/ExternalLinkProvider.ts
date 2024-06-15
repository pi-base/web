import * as vscode from 'vscode'
import { Ref } from '@pi-base/core'
import { matchingRanges } from './BaseEntityProvider'
import { Telemetry } from './Telemetry'

// Link external identifiers out to the corresponding authority.
export class ExternalLinkProvider implements vscode.DocumentLinkProvider {
  constructor(private readonly telemetry: Telemetry) {}

  provideDocumentLinks(document: vscode.TextDocument) {
    this.telemetry.trace('ExternalLinkProvider#provideDocumentLinks', {
      path: document.fileName,
    })

    // TODO: the set of supported kinds isn't easily open to extension (it's
    // easy to change in core but miss it here).
    const regex = /(?<kind>doi|mr|wikipedia|mathse|mo):\s*(?<id>[^\s}]*)/g

    return matchingRanges(
      document,
      regex,
      // Only link the ID part of the match (primarily so that links in
      // document frontmatters don't look wonky)
      match => [match[0].length - match.groups!.id.length, match[0].length],
    ).map(([range, match]) => {
      const { kind, id } = match.groups as { kind: Ref.Kind; id: string }
      const { href, title } = Ref.format({ kind, id })
      return {
        range,
        target: vscode.Uri.parse(href),
        tooltip: `View ${title}`,
      }
    })
  }
}
