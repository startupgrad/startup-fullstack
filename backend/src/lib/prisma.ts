import { PrismaClient } from '@prisma/client'
import { env } from './env'
import { logger } from './logger'

export const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'info',
      },
    ],
  })

  prisma.$on('query', (e) => {
    logger.info('prisma:low:query', 'Successfull request', {
      query: e.query,
      params: env.HOST_ENV === 'local' ? e.params : '***',
    })
  })

  prisma.$on('info', (e) => {
    logger.info('prisma:low:info', e.message)
  })

  prisma.$use(async (params, next) => {
    const start = Date.now()
    try {
      const result = await next(params)
      const durationMs = Date.now() - start
      logger.info('prisma:high', 'Successfull request', { params, durationMs })
      return result
    } catch (error) {
      const durationMs = Date.now() - start
      logger.error('prisma:high', error, { params, durationMs })
      throw error
    }
  })

  return prisma
}
