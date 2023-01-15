import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()} } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMe } from './auth/getMe'
import { signIn } from './auth/signIn'
import { signUp } from './auth/signUp'
import { updatePassword } from './auth/updatePassword'
import { updateProfile } from './auth/updateProfile'
import { createIdea } from './ideas/createIdea'
import { getIdea } from './ideas/getIdea'
import { getIdeas } from './ideas/getIdeas'
import { updateIdea } from './ideas/updateIdea'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()},`)
  getMe,
  signIn,
  signUp,
  updatePassword,
  updateProfile,
  createIdea,
  getIdea,
  getIdeas,
  updateIdea,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
