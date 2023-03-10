import { sharedEnv } from '@ideanick/shared/src/env'

type PumpedGetRouteInputBase = {
  abs?: boolean
}

function pumpGetRoute<T extends Record<string, boolean>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: Record<keyof T, string>) => string
): {
  (routeParams: Record<keyof T, string> & PumpedGetRouteInputBase): string
  placeholders: Record<keyof T, string>
  definition: string
}
function pumpGetRoute(getRoute: () => string): {
  (routeParams?: PumpedGetRouteInputBase): string
  placeholders: {}
  definition: string
}
function pumpGetRoute(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute
  const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute
  const placeholders = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
  const definition = getRoute(placeholders)
  const pumpedGetRoute = (routeParams?: PumpedGetRouteInputBase) => {
    const route = getRoute(routeParams)
    if (routeParams?.abs) {
      return `${sharedEnv.WEBAPP_URL}${route}`
    } else {
      return route
    }
  }
  pumpedGetRoute.placeholders = placeholders
  pumpedGetRoute.definition = definition
  return pumpedGetRoute
}

export const pgr = pumpGetRoute
