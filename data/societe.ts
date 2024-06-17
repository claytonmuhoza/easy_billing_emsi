'use server'
import { auth } from '@/auth'
import prisma from '@/helpers/db'
export const getSocieteId = async () => {
   const session = await auth()
   if (session) {
      const userId = session.user?.id
      if (userId) {
         const societeId = await prisma.userSociete.findFirst({
            where: { user_id: userId },
         })
         return societeId?.societe_id
      }
   }

   return undefined
}
