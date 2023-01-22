import { trpc } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { zUpdatePasswordInput } from './input'

export const updatePassword = trpc.procedure.input(zUpdatePasswordInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  if (ctx.me.password !== getPasswordHash(input.oldPassword)) {
    throw new Error('Wrong old password')
  }
  const updatedMe = await ctx.prisma.user.update({
    where: {
      id: ctx.me.id,
    },
    data: {
      password: getPasswordHash(input.newPassword),
    },
  })
  ctx.me = updatedMe
  return true
})