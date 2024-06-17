'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { CategorieSchema } from '@/schemas'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
export const newCategorieAction = async (
   values: z.infer<typeof CategorieSchema>,
) => {
   const validateField = CategorieSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le nom est obligatoire est doit contenir une lettre' }
   }
   const { nom } = validateField.data
   try {
      const societe_id = await getSocieteId()
      if (societe_id) {
         const existingArticle = await db.categorie.findUnique({
            where: {
               libelle_societe_id: { libelle: nom, societe_id: societe_id },
            },
         })
         if (existingArticle) {
            if (!existingArticle.activer) {
               await db.categorie.update({
                  where: {
                     libelle_societe_id: {
                        libelle: existingArticle.libelle,
                        societe_id,
                     },
                  },
                  data: { activer: true },
               })
               return { success: 'La categorie a été ajouter!' }
            } else {
               return { error: 'Une categorie portant ce nom existe déjà!' }
            }
         }
         await db.categorie.create({ data: { libelle: nom, societe_id } })
         return { success: 'La categorie a été ajouter!' }
      } else {
         return {
            error: "Une erreur s'est produit  lors de l'enregistrement. Réessayer!",
         }
      }
   } catch (e) {
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de la categorie. Réessayez!",
      }
   }
}
export const editCategorieAction = async (
   values: z.infer<typeof CategorieSchema>,
   id: number,
) => {
   const validateField = CategorieSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le nom est obligatoire est doit contenir une lettre' }
   }
   const { nom } = validateField.data
   try {
      const societe_id = await getSocieteId()
      if (societe_id) {
         const existingArticle = await db.categorie.findUnique({
            where: {
               libelle_societe_id: { libelle: nom, societe_id: societe_id },
            },
         })
         if (existingArticle && existingArticle.id !== id) {
            if (!existingArticle.activer) {
               await db.categorie.update({
                  where: {
                     libelle_societe_id: {
                        libelle: existingArticle.libelle,
                        societe_id,
                     },
                  },
                  data: { activer: true },
               })
               return { success: 'La categorie a été ajouter!' }
            } else {
               return { error: 'Une categorie portant ce nom existe déjà!' }
            }
         }
         await db.categorie.update({
            data: { libelle: nom, societe_id },
            where: { id },
         })
         return { success: 'La categorie a été modifier!' }
      } else {
         return {
            error: "Une erreur s'est produit  lors de l'enregistrement. Réessayer!",
         }
      }
   } catch (e) {
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de la categorie. Réessayez!",
      }
   }
}
export const updateCategorieAction = async (
   id: number,
   values: z.infer<typeof CategorieSchema>,
) => {
   const validateField = CategorieSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le nom est obligatoire est doit contenir une lettre' }
   }
   const { nom } = validateField.data
   try {
      await db.categorie.update({
         where: { id },
         data: { libelle: nom },
      })
   } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         if (e.code === 'P2002') {
            return { error: 'Une categorie portant ce nom existe déjà!' }
         }
      }
      return {
         error: "Une erreur s'est produit lors de l'enregistrement de la categorie. Réessayez!",
      }
   }
   return { success: 'La categorie a été ajouté' }
}
export const deleteCategorieAction = async (id: number) => {
   try {
      const exist = await db.categorie.findUnique({ where: { id } })
      if (exist) {
         await db.categorie.update({
            where: { id },
            data: { activer: false },
         })
         return {
            success: `La categorie ${exist.libelle} a été desactiver- avec succès!`,
         }
      } else {
         return { error: `La categorie n'existe pas` }
      }
   } catch (e) {
      return { error: "Une erreur s'est produit. veuillez réessayer!" }
   }
}
export const allCategorie = async () => {
   const societe_id = await getSocieteId()
   const categories = await db.categorie.findMany({
      where: { activer: true, societe_id },
      orderBy: { libelle: 'asc' },
   })
   return categories
}
