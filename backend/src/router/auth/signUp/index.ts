import { sendWelcomeEmail } from '../../../lib/emails'
import { ExpectedError } from '../../../lib/error'
import { logger } from '../../../lib/logger'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpInput } from './input'

export const signUp = trpcLoggedProcedure.input(zSignUpInput).mutation(async ({ ctx, input }) => {
  const exUserWithNick = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exUserWithNick) {
    throw new ExpectedError('User with this nick already exists')
  }
  const exUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })
  if (exUserWithEmail) {
    throw new ExpectedError('User with this email already exists')
  }
  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })
  void sendWelcomeEmail({ user }).catch((error) => logger.error('email', error))
  const token = signJWT(user.id)
  return { token }
})
