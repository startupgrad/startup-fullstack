import _ from 'lodash'
import { z } from 'zod'
import { trpc } from '../../../lib/trpc'

export const getIdea = trpc.procedure
  .input(
    z.object({
      ideaNick: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const rawIdea = await ctx.prisma.idea.findUnique({
      where: {
        nick: input.ideaNick,
      },
      include: {
        author: {
          select: {
            id: true,
            nick: true,
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
          where: {
            userId: ctx.me?.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })
    const isLikedByMe = !!rawIdea?.likes.length
    const likesCount = rawIdea?._count.likes || 0
    const idea = rawIdea && { ..._.omit(rawIdea, ['likes', '_count']), isLikedByMe, likesCount }
    return { idea }
  })
