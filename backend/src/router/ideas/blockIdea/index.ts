import { sendIdeaBlockedEmail } from '../../../lib/emails'
import { logger } from '../../../lib/logger'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canBlockIdeas } from '../../../utils/can'
import { zBlockIdeaInput } from './input'

export const blockIdea = trpcLoggedProcedure.input(zBlockIdeaInput).mutation(async ({ ctx, input }) => {
  const { ideaId } = input
  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    include: {
      author: true,
    },
  })
  if (!idea) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  void sendIdeaBlockedEmail({ user: idea.author, idea }).catch((error) => logger.error('email', error))
  return true
})
