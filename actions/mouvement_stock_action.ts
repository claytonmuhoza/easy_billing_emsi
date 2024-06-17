'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
export const get_entree_action = async () => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.mouvementStock.findMany({
         include: { unite_mesure: true, facture: true, produit: true },
         orderBy: { updateAt: 'desc' },
      })
   } else {
      return []
   }
}
