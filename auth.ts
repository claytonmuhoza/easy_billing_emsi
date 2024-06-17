import authConfig from '@/auth.config'
import prisma from '@/helpers/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
export const {
   handlers: { GET, POST },
   auth,
   signIn,
   signOut,
} = NextAuth({
   callbacks: {
      async session({ session, token }) {
         if (session.user && token.sub) {
            session.user.id = token.sub
         }
         return session
      },
      async jwt({ token }) {
         // console.log({ token })
         return token
      },
   },
   adapter: PrismaAdapter(prisma),
   session: { strategy: 'jwt' },

   ...authConfig,
})
