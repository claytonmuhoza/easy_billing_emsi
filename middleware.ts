import authConfig from '@/auth.config'
import { DEFAULT_Login_REDIRECT, apiAuthPrefix, publicRoutes } from '@/routes'
import NextAuth from 'next-auth'
const { auth } = NextAuth(authConfig)
export default auth((req) => {
   const { nextUrl } = req
   const isLoggedIn = !!req.auth
   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

   if (isApiAuthRoute) {
      return
   }
   if (nextUrl.pathname.startsWith('/api/autosend')) {
      return
   }
   if (isPublicRoute) {
      if (isLoggedIn) {
         return Response.redirect(new URL(DEFAULT_Login_REDIRECT, nextUrl))
      }
      return
   }
   if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL('/', nextUrl))
   }

   console.log('Route:' + req.nextUrl.pathname)
   console.log('User is logged in: ' + isLoggedIn)
   console.log('req.auth' + JSON.stringify(req.auth))
   return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
