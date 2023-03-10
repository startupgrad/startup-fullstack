import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignInInput } from './input'

export const signIn = trpcLoggedProcedure.input(zSignInInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  })
  if (!user) {
    throw new ExpectedError('Wrong nick or password')
  }
  const token = signJWT(user.id)
  return { token, userId: user.id }
})
