'use server'

import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { UniteMesureSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
export const newUnitAction = async (
   values: z.infer<typeof UniteMesureSchema>,
) => {
   const validateField = UniteMesureSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le nom est obligatoire est doit contenir une lettre' }
   }
   const { nom } = validateField.data
   try {
      const societe_id = await getSocieteId()
      if (societe_id) {
         const existingArticle = await db.uniteMesure.findUnique({
            where: { libelle_societe_id: { libelle: nom, societe_id } },
         })
         if (existingArticle) {
            if (!existingArticle.activer) {
               await db.uniteMesure.update({
                  where: {
                     libelle_societe_id: {
                        libelle: existingArticle.libelle,
                        societe_id,
                     },
                  },
                  data: { activer: true },
               })
               revalidatePath('/unite')
               return { success: "l'unité de mesure a été ajouter!" }
            } else {
               return {
                  error: 'Une unité de mesure portant ce nom existe déjà!',
               }
            }
         }
         await db.uniteMesure.create({ data: { libelle: nom, societe_id } })
         revalidatePath('/unite')
         return { success: "L'unité de mesure a été ajouter!" }
      }
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de l'unité de mesure. Réessayez!",
      }
   } catch (e) {
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de l'unité de mesure. Réessayez!",
      }
   }
}
export const editUnitAction = async (
   values: z.infer<typeof UniteMesureSchema>,
   id: number,
) => {
   const validateField = UniteMesureSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le nom est obligatoire est doit contenir une lettre' }
   }
   const { nom } = validateField.data
   try {
      const societe_id = await getSocieteId()
      if (societe_id) {
         const existingArticle = await db.uniteMesure.findUnique({
            where: { libelle_societe_id: { libelle: nom, societe_id } },
         })
         if (existingArticle && existingArticle.id !== id) {
            if (!existingArticle.activer) {
               await db.uniteMesure.update({
                  where: {
                     libelle_societe_id: {
                        libelle: existingArticle.libelle,
                        societe_id,
                     },
                  },
                  data: { activer: true },
               })
               revalidatePath('/unite')
               return { success: "l'unité de mesure a été ajouter!" }
            } else {
               return {
                  error: 'Une unité de mesure portant ce nom existe déjà!',
               }
            }
         }
         await db.uniteMesure.update({
            data: { libelle: nom, societe_id },
            where: { id },
         })
         revalidatePath('/unite')
         return { success: "L'unité de mesure a été modifier!" }
      }
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de l'unité de mesure. Réessayez!",
      }
   } catch (e) {
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de l'unité de mesure. Réessayez!",
      }
   }
}
export const allUniteMesure = async () => {
   const societe_id = await getSocieteId()
   const uniteMesures = await db.uniteMesure.findMany({
      where: { activer: true, societe_id },
      orderBy: { libelle: 'asc' },
   })
   return uniteMesures
}
