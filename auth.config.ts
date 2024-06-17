import { getUserByEmail } from '@/data/user'
import { LoginSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import credentials from 'next-auth/providers/credentials'
export default {
   providers: [
      credentials({
         async authorize(credentials) {
            const validateField = LoginSchema.safeParse(credentials)
            if (validateField.success) {
               const { email, password } = validateField.data
               const user = await getUserByEmail(email)

               if (!user || !user.password) return null
               const passwordMatch = await bcrypt.compare(
                  password,
                  user.password,
               )
               if (passwordMatch) return user
            }
            return null
         },
      }),
   ],
   trustHost: true,
} satisfies NextAuthConfig
