import chalk from 'chalk'
import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import sse from 'better-sse'

import { bundle } from '@pi-base/core'

type State = {
  bundle: bundle.Bundle | undefined
  errors: Map<string, string[]> | undefined
}

type Logger = (message: string, ...args: any[]) => void

const { cyan } = chalk

export function boot({ log, port }: { log: Logger; port: number }): {
  app: Express
  setState: (updates: Partial<State>) => void
} {
  let state: State = { bundle: undefined, errors: undefined }

  const reloadChannel = sse.createChannel()

  function setState(updates: Partial<State>) {
    state = { ...state, ...updates }
    reloadChannel.broadcast({ version: state.bundle?.version }, 'bundle.reload')
  }

  const app = express()

  app.use(
    cors({
      origin: '*',
      exposedHeaders: ['ETag'],
    }),
  )

  app.use((req: Request, res: Response, next: NextFunction) => {
    log(`${cyan(req.method)} ${req.originalUrl}`)
    res.set('Cache-control', 'no-store')
    next()
  })

  function view(_: Request, res: Response) {
    // n.b. we're not currently verifying params.branch matches
    res.setHeader('ETag', state.bundle ? state.bundle.version.sha : 'unknown')
    res.json(
      state.bundle
        ? bundle.serialize(state.bundle)
        : { message: 'The bundle is not available', errors: state.errors },
    )
  }

  app.get('/', view)
  app.get('/refs/heads/:branch', view)

  app.get('/errors', (_, res: Response) => {
    res.json(state.errors)
  })

  app.get('/sse', async (req, res) => {
    const session = await sse.createSession(req, res)
    reloadChannel.register(session)
  })

  app.listen(port, () => {
    log(`Server running at http://localhost:${cyan(port)}.`)
  })

  return {
    app,
    setState,
  }
}
