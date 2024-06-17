'use server'
import { signIn } from '@/auth'
import { DEFAULT_Login_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schemas'
// import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import * as z from 'zod'
export const login = async (values: z.infer<typeof LoginSchema>) => {
   const validateField = LoginSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Les champs sont invalide' }
   } else {
      const { email, password } = validateField.data
      try {
         await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_Login_REDIRECT,
         })
      } catch (e) {
         if (e instanceof AuthError) {
            switch (e.type) {
               case 'CredentialsSignin':
                  return {
                     error: 'email ou mot de passe incorrect!',
                  }
               default:
                  return { error: 'il y a eu une erreur, veuillez réessayer' }
            }
         }
         throw e
      }
   }
}
