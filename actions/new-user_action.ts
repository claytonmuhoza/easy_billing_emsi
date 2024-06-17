'use server'
import { getUserByEmail } from '@/data/user'
import prisma from '@/helpers/db'
import { NewUserSchema } from '@/schemas'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as z from 'zod'
export const NewUserAction = async (values: z.infer<typeof NewUserSchema>) => {
   const validateField = NewUserSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le formulaire a été mal rempli. Veuillez réessayer' }
   } else {
      try {
         const { name, email, password, societe_id } = validateField.data
         const hashedPassword = await bcrypt.hash(password, 10)
         const existingUser = await getUserByEmail(email)
         if (existingUser)
            return { error: "Un utilisateur possede déjà ce nom d'utilisateur" }
         const lowcaseName = email.toLowerCase()
         await prisma.user
            .create({
               data: {
                  name,
                  email: lowcaseName,
                  password: hashedPassword,
               },
            })
            .then(async (utilisateur) => {
               await prisma.userSociete.create({
                  data: { user_id: utilisateur.id, societe_id },
               })
            })

         return { success: 'Utilisateur enregistré avec succès' }
      } catch (e) {
         if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
               return {
                  error: "Un utilisateur possede déjà ce nom d'utilisateur",
               }
            } else {
               return {
                  error: "une erreur c'est produit lors de l'enregistrement de l'utilisateur ",
               }
            }
         } else {
            return {
               error: "une erreur c'est produit lors de l'enregistrement de l'utilisateur",
            }
         }
      }
   }
}
