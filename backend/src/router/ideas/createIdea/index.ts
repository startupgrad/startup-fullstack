import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateIdeaInput } from './input'

export const createIdea = trpcLoggedProcedure.input(zCreateIdeaInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const exIdea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exIdea) {
    throw new ExpectedError('Idea with this nick already exists')
  }
  await ctx.prisma.idea.create({
    data: {
      ...input,
      authorId: ctx.me.id,
    },
  })
  return true
})
