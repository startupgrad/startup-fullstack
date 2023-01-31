import type { TrpcRouter } from '@ideanick/backend/src/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCLink, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { observable } from '@trpc/server/observable'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { env } from './env'
import { sentryCaptureException } from './sentry'

export const trpc = createTRPCReact<TrpcRouter>()

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value)
        },
        error(error) {
          if (error.data?.type !== 'ExpectedError') {
            if (env.NODE_ENV !== 'development') {
              console.error(error)
            }
            sentryCaptureException(error)
          }
          observer.error(error)
        },
        complete() {
          observer.complete()
        },
      })
      return unsubscribe
    })
  }
}

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        customTrpcLink,
        loggerLink({
          enabled: () => env.NODE_ENV === 'development',
        }),
        httpBatchLink({
          url: env.VITE_BACKEND_URL,
          headers: () => {
            const token = Cookies.get('token')
            return {
              ...(token && { authorization: `Bearer ${token}` }),
            }
          },
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
