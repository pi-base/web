import * as vscode from 'vscode'
import { matchingRanges } from './BaseEntityProvider'
import { debug } from '../models/logging'

type LinkKinds = 'doi' | 'mr' | 'wikipedia' | 'mathse' | 'mo'

export class ExternalLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument) {
    debug('ExternalLinkProvider#provideDocumentLinks')

    const regex = /(?<kind>doi|mr|wikipedia|mathse|mo):\s*(?<id>[^\s}]*)/g

    return matchingRanges(
      document,
      regex,
      // Only link the ID part of the match (primarily so that links in
      // document frontmatters don't look wonky)
      match => [match[0].length - match.groups!.id.length, match[0].length],
    ).map(([range, match]) => {
      const { kind, id } = match.groups as { kind: LinkKinds; id: string }
      const { href, title } = format(kind, id)
      return {
        range,
        target: vscode.Uri.parse(href),
        tooltip: `View ${title}`,
      }
    })
  }
}

function format(kind: LinkKinds, id: string) {
  switch (kind) {
    case 'doi':
      return { href: `https://doi.org/${id}`, title: `DOI ${id}` }
    case 'mr':
      return {
        href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
        title: `MR ${id}`,
      }
    case 'wikipedia':
      return {
        href: `https://en.wikipedia.org/wiki/${id}`,
        title: `Wikipedia ${id}`,
      }
    case 'mathse':
      return {
        href: `https://math.stackexchange.com/questions/${id}`,
        title: `Math StackExchange ${id}`,
      }
    case 'mo':
      return {
        href: `https://mathoverflow.net/questions/${id}`,
        title: `MathOverflow ${id}`,
      }
  }
}
