'use server'

import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { contribuable_update_schema } from '@/schemas'
import { z } from 'zod'
export const get_contribuable_action = async () => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.societe.findUnique({ where: { id: societe_id } })
   } else {
      return null
   }
}
export const update_contribuable_action = async (
   values: z.infer<typeof contribuable_update_schema>,
   id: number,
) => {
   const validateField = contribuable_update_schema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le formulaire est invalide. Veuillez réessayer!' }
   } else {
      const {
         nom,
         nif,
         rc,
         tva,
         tc,
         contact_bp,
         contact_email,
         contact_telephone,
         prelevement_forfetaire,
         direction_fiscale,
         forme_juridique,
         raison_social,
         adresse_province,
         adresse_commune,
         adresse_avenue,
         adresse_quartier,
         adresse_numero,
      } = validateField.data
      try {
         await db.societe.update({
            data: {
               nom,
               nif,
               rc,
               tva,
               tc,
               type_societe: validateField.data.type_contribuable.toString(),
               forme_juridique,
               prelevement_forfetaire,
               direction_fiscale,
               secteur_activite: raison_social,
               telephone: contact_telephone,
               email: contact_email,
               bp: contact_bp,
               adresse_province,
               adresse_commune,
               adresse_quartier,
               adresse_avenue,
               adresse_numero,
            },
            where: { id },
         })
         return { success: 'Les informations ont été enregistrés  avec succès' }
      } catch (e) {
         //todo
         return {
            error: "une erreur s'est produit lors de l'enregistrement dans la base de donnée! Réessayez",
         }
      }
   }
}
