import path from 'path'
import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { env } from './env'

if (env.BACKEND_SENTRY_DSN) {
  Sentry.init({
    dsn: env.BACKEND_SENTRY_DSN,
    environment: env.HOST_ENV,
    release: env.SOURCE_VERSION,
    normalizeDepth: 10,
    integrations: [
      new RewriteFrames({
        root: path.resolve(__dirname, '../../..'),
      }),
    ],
  })
}

export const sentryCaptureException = (error: Error) => {
  if (env.BACKEND_SENTRY_DSN) {
    Sentry.captureException(error)
  }
}
