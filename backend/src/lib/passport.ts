import { Express } from 'express'
import { Passport } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { AppContext } from './ctx'
import { env } from './env'

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext): void => {
  const passport = new Passport()

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: string, done) => {
        ctx.prisma.user
          .findUnique({
            where: { id: jwtPayload },
          })
          .then((user) => {
            if (!user) {
              return done(null, false)
            }
            return done(null, user)
          })
          .catch((error) => {
            return done(error, false)
          })
      }
    )
  )

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      return next()
    }
    passport.authenticate('jwt', { session: false })(req, res, next)
  })
}
