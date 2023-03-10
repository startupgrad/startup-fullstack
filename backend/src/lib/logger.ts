import { EOL } from 'os'
import { omit } from '@ideanick/shared/src/omit'
import { TRPCError } from '@trpc/server'
import debug from 'debug'
import _ from 'lodash'
import pc from 'picocolors'
import { serializeError } from 'serialize-error'
import { MESSAGE } from 'triple-beam'
import winston from 'winston'
import * as yaml from 'yaml'
import { hideSensetiveData } from '../utils/hideSensetiveData'
import { env } from './env'
import { ExpectedError } from './error'
import { sentryCaptureException } from './sentry'

const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? winston.format.simple()
          : winston.format((logData) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug']
              const levelAndType = `${logData.level} ${logData.logType}`
              const topMessage = `${setColor(levelAndType)} ${pc.green(logData.timestamp)}${EOL}${logData.message}`

              const visibleMessageTags = omit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ])

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (k, v) => (_.isFunction(v) ? 'Function' : v))
              )

              const resultLogData = {
                ...logData,
                [MESSAGE]:
                  [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifyedLogData}` : '']
                    .filter(Boolean)
                    .join('') + EOL,
              }

              return resultLogData
            })(),
    }),
  ],
})

export const logger = {
  info: (logType: string, message: string, meta?: Record<string, any>) => {
    if (!debug.enabled(`ideanick:${logType}`)) {
      return
    }
    winstonLogger.info(message, { logType, ...hideSensetiveData(meta) })
  },
  error: (logType: string, error: any, meta?: Record<string, any>) => {
    const isNativeExpectedError = error instanceof ExpectedError
    const isTrpcExpectedError = error instanceof TRPCError && error.cause instanceof ExpectedError
    if (!isNativeExpectedError && !isTrpcExpectedError) {
      sentryCaptureException(error)
    }
    if (!debug.enabled(`ideanick:${logType}`)) {
      return
    }
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      ...hideSensetiveData(meta),
    })
  },
}
