import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()} } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getIdea } from './getIdea'
import { getIdeas } from './getIdeas'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()},`)
  getIdea,
  getIdeas,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
