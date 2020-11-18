import * as Sentry from '@sentry/browser'

type Meta = Record<string, unknown>

export type Handler = (error: Error, meta?: Meta) => void

export function log(): Handler {
  return function handle(error: Error, meta: Meta = {}) {
    console.error(error, meta)
  }
}

export function sentry(dsn: string): Handler {
  const release = 'FIXME'

  Sentry.init({ dsn, release })

  return function handle(error: Error, meta: Meta = {}) {
    Sentry.withScope((scope) => {
      Object.entries(meta).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
      Sentry.captureException(error)
    })
  }
}
