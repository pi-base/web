import * as vscode from 'vscode'
import { EntityStore } from '../models/EntityStore'

export class BaseEntityProvider {
  constructor(protected readonly entities: EntityStore) {}

  protected entityAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const range = document.getWordRangeAtPosition(position)
    const word = range ? document.getText(range) : ''
    return this.entities.lookup(word)
  }
}

export function matchingRanges(
  document: vscode.TextDocument,
  exp: RegExp,
  span: (match: RegExpMatchArray) => [number, number] = match => [
    0,
    match[0].length,
  ],
) {
  return Array.from(document.getText().matchAll(exp)).map(match => {
    const [start, end] = span(match)
    return [
      new vscode.Range(
        document.positionAt(match.index + start),
        document.positionAt(match.index + end),
      ),
      match,
    ] as const
  })
}
