import { pgr } from '../utils/pumpGetRoute'

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getAllIdeasRoute = pgr(() => '/')

export const getViewIdeaRoute = pgr({ ideaNick: true }, ({ ideaNick }) => `/ideas/${ideaNick}`)
export type ViewIdeaRouteParams = typeof getViewIdeaRoute.placeholders

export const getEditIdeaRoute = pgr({ ideaNick: true }, ({ ideaNick }) => `/ideas/${ideaNick}/edit`)
export type EditIdeaRouteParams = typeof getEditIdeaRoute.placeholders

export const getNewIdeaRoute = pgr(() => '/ideas/new')
