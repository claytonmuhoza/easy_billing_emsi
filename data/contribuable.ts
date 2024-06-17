'use server'
import db from '@/helpers/db'
export const getAllSociete = async () => {
   const societes = await db.societe.findMany()
   return societes
}
export const getCurrentSociete = async () => {
   const societes = await db.societe.findFirst()
   return societes
}
