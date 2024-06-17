import * as vscode from 'vscode'

// Abstract file store to support files that could be either on disk or being
// edited in memory.
export class Files {
  #store: Record<string, string> = {}

  constructor(
    private readonly root: vscode.Uri,
    private readonly fs: vscode.FileSystem,
  ) {}

  // @throws {Error} if file not found
  // @returns {contents, uri} where uri is the full expanded URI for the given path
  async read(path: string) {
    const { key, uri } = this.expand(path)

    if (!this.#store[key]) {
      const bytes = await this.fs.readFile(uri)
      this.#store[key] = new TextDecoder().decode(bytes)
    }

    return { contents: this.#store[key], uri }
  }

  set(path: string, contents: string) {
    const { key } = this.expand(path)

    this.#store[key] = contents
  }

  private expand(path: string) {
    // In github.dev, file URIs look like vscode-vfs://github%2B.../pi-base/data/...
    // See also notes in https://code.visualstudio.com/api/extension-guides/web-extensions#migrate-extension-with-code
    const { scheme, authority, path: rootPath } = this.root
    const uri = vscode.Uri.file(`${rootPath}/${path}`).with({
      scheme,
      authority,
    })
    return { key: uri.path, uri }
  }
}
