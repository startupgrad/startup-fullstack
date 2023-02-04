import { omit } from '@ideanick/shared/src/omit'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetIdeasInput } from './input'

export const getIdeas = trpcLoggedProcedure.input(zGetIdeasInput).query(async ({ ctx, input }) => {
  const rawIdeas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    where: {
      blockedAt: null,
      ...(!input.search
        ? {}
        : {
            OR: [
              {
                name: {
                  search: input.search,
                },
              },
              {
                description: {
                  search: input.search,
                },
              },
              {
                text: {
                  search: input.search,
                },
              },
            ],
          }),
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
  const nextIdea = rawIdeas.at(input.limit)
  const nextCursor = nextIdea?.createdAt
  const rawIdeasExceptNext = rawIdeas.slice(0, input.limit)
  const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
    ...omit(idea, ['_count']),
    likesCount: idea._count.likes,
  }))

  return { ideas: ideasExceptNext, nextCursor }
})
