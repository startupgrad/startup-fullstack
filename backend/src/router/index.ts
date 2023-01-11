import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()} } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createIdea } from './createIdea'
import { getIdea } from './getIdea'
import { getIdeas } from './getIdeas'
import { getMe } from './getMe'
import { signIn } from './signIn'
import { signUp } from './signUp'
import { updateIdea } from './updateIdea'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()},`)
  createIdea,
  getIdea,
  getIdeas,
  getMe,
  signIn,
  signUp,
  updateIdea,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
