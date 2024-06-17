import * as vscode from 'vscode'
import { Ref, parser } from '@pi-base/core'
import { Telemetry } from '../providers/Telemetry'
import { openUriLink } from '../utils'

// Render contents for an on-hover preview of an entity
export class EntityPreviewPresenter {
  constructor(private readonly telemetry: Telemetry) {}

  async render({
    uri,
    name,
    description,
  }: {
    uri: vscode.Uri
    name: string
    description: string
  }) {
    return [this.title(uri, name), await this.body(uri, description)]
  }

  title(uri: vscode.Uri, name: string) {
    const title = new vscode.MarkdownString(`# [${name}](${openUriLink(uri)})`)
    title.isTrusted = true
    return title
  }

  async body(uri: vscode.Uri, description: string) {
    // TODO: currently the parser expects the internal link resolver to be
    // synchronous. For now we just don't render internal links in previews,
    // but we have two options to improve this:
    //
    // 1. Update the parser to support async link resolvers
    // 2. Preload all matching files on the filesystem to build an entity lookup
    const parse = parser({
      link: {
        external: ([kind, id]) => Ref.format({ kind, id }),
      },
      truncate: false,
    })

    const body = new vscode.MarkdownString()
    try {
      const parsed = await parse.process(description)
      // FIXME: the katex rendering leads to very tall lines in the hover
      // preview, but there doesn't appear to be an obvious way to style it.
      body.appendMarkdown(parsed.value.toString())
      body.isTrusted = true
      body.supportHtml = true
    } catch (error) {
      this.telemetry.bodyParseFailed({ uri, error, body: description })
      body.appendMarkdown(`\n\n${description}`)
    }

    return body
  }
}
