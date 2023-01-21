import _ from 'lodash'
import { trpc } from '../../../lib/trpc'
import { zGetIdeasInput } from './input'

export const getIdeas = trpc.procedure.input(zGetIdeasInput).query(async ({ ctx, input }) => {
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
    ..._.omit(idea, ['_count']),
    likesCount: idea._count.likes,
  }))

  return { ideas: ideasExceptNext, nextCursor }
})
