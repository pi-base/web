import * as vscode from 'vscode'
import { Uri, window } from 'vscode'
import createDebug from 'debug'

type Window = typeof window // Pick<typeof window, 'showErrorMessage'>

// A [domain probe](https://martinfowler.com/articles/domain-oriented-observability.html)
// for tracking various events.
//
// For now, these typically just log, but in the future, we may look at presenting
// errors back to the user &/or collecting error logs remotely.
// See https://code.visualstudio.com/api/extension-capabilities/common-capabilities#display-notifications
export class Telemetry {
  trace: (message: string, fields?: Record<string, unknown>) => void

  constructor(private readonly window: Window) {
    // HACK: when running in a web context, we don't want to flood the logs
    // unless-and-until the user opts in - in this case, by setting
    //
    //   localStorage.debug = 'pi-base:*' (or '*' for all logs)
    //
    // but when running on the desktop, we can just log straightaway.
    if (typeof localStorage === 'undefined') {
      this.trace = console.log
    } else {
      this.trace = createDebug('pi-base')
    }
  }

  activating() {
    this.trace('Initializing π-base extension')
  }

  activated() {
    this.trace('Activation complete')
  }

  activationFailed(error: unknown) {
    const message = 'Failed to initialize π-base extension'
    this.trace(message, { error })
    this.window.showErrorMessage(`${message}: ${error}`)
  }

  activationSkipped() {
    this.trace(
      'No data folder found in workspace. Skipping π-base initialization.',
    )
  }

  bodyParseFailed(meta: { uri: Uri; body: string; error: unknown }) {
    this.trace('Error parsing entity description', meta)
  }

  fileParseFailed(meta: { path: string; contents: string; error: unknown }) {
    this.trace('Error parsing file', meta)
  }

  entityLookupFailed(key: string, error: unknown) {
    this.trace('Failed to lookup', { key, error })
  }
}
