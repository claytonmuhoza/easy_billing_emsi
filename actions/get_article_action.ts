'use server'
import db from '@/helpers/db'
export const get_article_stockable = async (search: string) => {
   return db.produit.findMany({
      include: { unite_mesure: true, categorie: true },
      where: { nom: { contains: search }, stockable: true },
   })
}
