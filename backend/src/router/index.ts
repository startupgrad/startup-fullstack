import { trpc } from '../lib/trpc'
import { getIdea } from './getIdea'
import { getIdeas } from './getIdeas'

export const trpcRouter = trpc.router({
  getIdea,
  getIdeas,
})

export type TrpcRouter = typeof trpcRouter
