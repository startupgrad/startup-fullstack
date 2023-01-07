import { User } from '@prisma/client'
import { inferAsyncReturnType, initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { Express } from 'express'
import type { TrpcRouter } from '../router'
import { AppContext } from './ctx'

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as never as { user: User | undefined }).user || null,
  })

type TrpcContext = inferAsyncReturnType<ReturnType<typeof getCreateTrpcContext>>

export const trpc = initTRPC.context<TrpcContext>().create()

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )
}
