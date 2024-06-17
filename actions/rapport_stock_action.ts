'use server'
import db from '@/helpers/db'
import { rapport_stock_filter_schema } from '@/schemas'
import { z } from 'zod'
export const rapport_stock_action = async (
   values: z.infer<typeof rapport_stock_filter_schema>,
) => {
   const valide = rapport_stock_filter_schema.safeParse(values)
   if (valide.success) {
      const { date_debut, date_fin } = valide.data
      if (date_debut && date_fin) {
         const date_de_debut = new Date(date_debut)
         const date_de_fin = new Date(date_fin)
         const rapportStock = await db.produit.findMany({
            include: {
               mouvements_stock: {
                  where: {
                     createAt: { gte: date_de_debut, lte: date_de_fin },
                  },
               },
            },
            orderBy: { nom: 'asc' },
            where: { stockable: true },
         })
         return rapportStock
      } else {
         if (date_debut) {
            const date_de_debut = new Date(date_debut)
            const rapportStock = await db.produit.findMany({
               include: {
                  mouvements_stock: {
                     where: { createAt: { gte: date_de_debut } },
                  },
               },
               orderBy: { nom: 'asc' },
               where: { stockable: true },
            })
            return rapportStock
         } else {
            if (date_fin) {
               const date_de_fin = new Date(date_fin)
               const rapportStock = await db.produit.findMany({
                  include: {
                     mouvements_stock: {
                        where: { createAt: { lte: date_de_fin } },
                     },
                  },
                  orderBy: { nom: 'asc' },
                  where: { stockable: true },
               })
               return rapportStock
            } else {
               const rapportStock = await db.produit.findMany({
                  include: { mouvements_stock: true },
                  orderBy: { nom: 'asc' },
                  where: { stockable: true },
               })
               return rapportStock
            }
         }
      }
   } else {
      return []
   }
}
