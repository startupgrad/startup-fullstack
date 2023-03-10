/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/order
const { env } = require('./lib/env')

import cors from 'cors'
import express from 'express'
import { applyCron } from './lib/cron'
import { AppContext, createAppContext } from './lib/ctx'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/passport'
import { applyServeWebApp } from './lib/serveWebApp'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = await createAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.use(cors())
    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    applyServeWebApp(expressApp)
    applyCron(ctx)
    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error)
      if (res.headersSent) {
        return next(error)
      }
      res.status(500).send('Internal server error')
    })
    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()
