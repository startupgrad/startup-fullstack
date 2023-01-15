import { trpc } from '../../../lib/trpc'
import { zGetIdeasInput } from './input'

export const getIdeas = trpc.procedure.input(zGetIdeasInput).query(async ({ ctx, input }) => {
  const ideas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    cursor: !input.cursor
      ? undefined
      : {
          createdAt: input.cursor,
        },
    take: input.limit + 1,
  })
  const nextIdea = ideas.at(input.limit)
  const nextCursor = nextIdea?.createdAt
  const ideasExceptNext = ideas.slice(0, input.limit)

  return { ideas: ideasExceptNext, nextCursor }
})
