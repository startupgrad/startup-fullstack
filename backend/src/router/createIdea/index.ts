import { ideas } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'
import { zCreateIdeaInput } from './input'

export const createIdea = trpc.procedure.input(zCreateIdeaInput).mutation(({ input }) => {
  ideas.unshift(input)
  return true
})
