import * as Sentry from '@sentry/browser'
import { build, sentryIngest } from '@/constants'

type Meta = Record<string, unknown>

export type Handler = (error: Error, meta?: Meta) => void

export type Environment = 'production' | 'deploy-preview' | 'dev'

export function log(): Handler {
  return function handle(error: Error, meta: Meta = {}) {
    console.error(error, meta)
  }
}

export function sentry({
  dsn = sentryIngest,
  environment,
}: {
  dsn?: string
  environment: Environment
}): Handler {
  const release = `pi-base@${build.version}`

  Sentry.init({ dsn, release, environment })

  return function handle(error: Error, meta: Meta = {}) {
    Sentry.withScope(scope => {
      Object.entries(meta).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
      Sentry.captureException(error)
    })
  }
}
