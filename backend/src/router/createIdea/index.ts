import { ideas } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'
import { zCreateIdeaInput } from './input'

export const createIdea = trpc.procedure.input(zCreateIdeaInput).mutation(({ input }) => {
  if (ideas.find((idea) => idea.nick === input.nick)) {
    throw new Error('Idea with this nick already exists')
  }
  ideas.unshift(input)
  return true
})
