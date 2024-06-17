'use server'

import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { banqueSchema } from '@/schemas'
import { z } from 'zod'
export const get_all_banque_action = async (searchWord?: string) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.banque.findMany({
         where: {
            OR: [
               {
                  nom_bank: { contains: searchWord },
               },
               { numero_compte: { contains: searchWord } },
            ],
         },
      })
   } else {
      return []
   }
}
export const create_banque_action = async (
   values: z.infer<typeof banqueSchema>,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validate = banqueSchema.safeParse(values)
      if (validate.success) {
         const valideData = validate.data
         await db.banque.create({
            data: {
               nom_bank: valideData.nom_banque,
               numero_compte: valideData.numero_compte_banque,
               societe_id: societe_id,
            },
         })
         return {
            success: true,
            msg: 'la banque a été enregistrée avec succès',
         }
      } else {
         return { success: false, msg: "Le formulaire n'est pas valide" }
      }
   } else {
      return {
         success: false,
         msg: "Une erreur s'est produit lors de la recuperation de la société",
      }
   }
}
export const update_banque_action = async (
   values: z.infer<typeof banqueSchema>,
   id_banque: number,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validate = banqueSchema.safeParse(values)
      if (validate.success) {
         const valideData = validate.data
         await db.banque.update({
            data: {
               nom_bank: valideData.nom_banque,
               numero_compte: valideData.numero_compte_banque,
               societe_id: societe_id,
            },
            where: { id: id_banque },
         })
         return {
            success: 'true',
            msg: 'La banque a été mise  à jours avec succès',
         }
      } else {
         return { success: false, msg: "Le formulaire n'est pas valide" }
      }
   } else {
      return {
         success: false,
         msg: "Une erreur s'est produit lors de la recuperation de la société",
      }
   }
}
