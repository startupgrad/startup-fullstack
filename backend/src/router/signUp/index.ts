import crypto from 'crypto'
import { trpc } from '../../lib/trpc'
import { zSignUpInput } from './input'

export const signUp = trpc.procedure.input(zSignUpInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exUser) {
    throw new Error('User with this nick already exists')
  }
  await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      password: crypto.createHash('sha256').update(input.password).digest('hex'),
    },
  })
  return true
})
