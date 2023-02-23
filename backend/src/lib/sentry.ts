import path from 'path'
import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { env } from './env'

const isSentryEnabled = env.BACKEND_SENTRY_DSN && env.NODE_ENV !== 'test'

if (isSentryEnabled) {
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
  if (isSentryEnabled) {
    Sentry.captureException(error)
  }
}
