import { z } from 'zod'
import { ideas } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'

export const getIdea = trpc.procedure
  .input(
    z.object({
      ideaNick: z.string(),
    })
  )
  .query(({ input }) => {
    return { idea: ideas.find((idea) => idea.nick === input.ideaNick) || null }
  })
