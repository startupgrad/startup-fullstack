import { omit } from '@ideanick/shared/src/omit'
import { z } from 'zod'
import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'

export const getIdea = trpcLoggedProcedure
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
    if (rawIdea?.blockedAt) {
      throw new ExpectedError('Idea is blocked by administrator')
    }
    const isLikedByMe = !!rawIdea?.likes.length
    const likesCount = rawIdea?._count.likes || 0
    const idea = rawIdea && { ...omit(rawIdea, ['likes', '_count']), isLikedByMe, likesCount }
    return { idea }
  })
