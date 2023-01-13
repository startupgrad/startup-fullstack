import _ from 'lodash'
import { trpc } from '../../../lib/trpc'

export const getMe = trpc.procedure.query(({ ctx }) => {
  return { me: ctx.me && _.pick(ctx.me, ['id', 'nick']) }
})
