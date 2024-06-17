'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { ClientShema } from '@/schemas'
import { z } from 'zod'
import { nif_check } from './ebms/nif_check'
export const create_client_action = async (
   values: z.infer<typeof ClientShema>,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validateField = ClientShema.safeParse(values)
      if (!validateField.success) {
         return { success: false, msg: "Le formulaire n'est pas valide!" }
      } else {
         const valideData = validateField.data
         if (valideData.nif_entreprise_client.length >= 1) {
            const nif_result = await nif_check(valideData.nif_entreprise_client)
            if (nif_result.success) {
               valideData.nom_entreprise_client =
                  nif_result.result.taxpayer[0].tp_name
            } else {
               return { success: false, msg: nif_result.msg }
            }
         }
         const isLocalClient = valideData.localisation_client === 'local'
         await db.client.create({
            data: {
               NIF: valideData.nif_entreprise_client,
               nom: valideData.nom_entreprise_client,
               assujetti_tva: valideData.assujetti_tva_client,
               isLocalClient,
               type_personne: valideData.type_client,
               client_boite_postal: valideData.boite_postal_client,
               client_mail: valideData.adresse_mail_client,
               client_telephone: valideData.numero_telephone_client,
               secteur_activite: valideData.secteur_activite_client,
               adresse: valideData.adresse_client,
               personne_contact_nom: valideData.personne_contact_client,
               personne_contact_telephone:
                  valideData.contact_personne_contact_client,
               societe_id,
            },
         })
         return { success: true, msg: 'Le client a été ajouté avec succès' }
      }
   } else {
      return {
         success: false,
         msg: "Une erreur s'est produit lors de la recuperation du client",
      }
   }
}
export const modifier_client_action = async (
   values: z.infer<typeof ClientShema>,
   id: number,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validateField = ClientShema.safeParse(values)
      if (!validateField.success) {
         return { success: false, msg: "Le formulaire n'est pas valide!" }
      } else {
         const valideData = validateField.data
         if (valideData.nif_entreprise_client.length >= 1) {
            const nif_result = await nif_check(valideData.nif_entreprise_client)
            if (nif_result.success) {
               // valideData.nom_entreprise_client =
               //    nif_result.result.taxpayer[0].tp_name
            } else {
               return { success: false, msg: nif_result.msg }
            }
         }
         const isLocalClient = valideData.localisation_client === 'local'
         await db.client.update({
            data: {
               NIF: valideData.nif_entreprise_client,
               nom: valideData.nom_entreprise_client,
               assujetti_tva: valideData.assujetti_tva_client,
               isLocalClient,
               type_personne: valideData.type_client,
               client_boite_postal: valideData.boite_postal_client,
               client_mail: valideData.adresse_mail_client,
               client_telephone: valideData.numero_telephone_client,
               secteur_activite: valideData.secteur_activite_client,
               adresse: valideData.adresse_client,
               personne_contact_nom: valideData.personne_contact_client,
               personne_contact_telephone:
                  valideData.contact_personne_contact_client,
               societe_id,
            },
            where: { id },
         })
         return { success: true, msg: 'Le client a été ajouté avec succès' }
      }
   } else {
      return {
         success: false,
         msg: "Une erreur s'est produit lors de la recuperation du client",
      }
   }
}
export const get_client_action = async (
   searchWord: string,
   minimal = false,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      if (minimal) {
         return db.client.findMany({
            where: {
               societe_id,
               OR: [
                  { nom: { contains: searchWord } },
                  { NIF: { contains: searchWord } },
               ],
            },
            orderBy: { nom: 'asc' },
         })
      } else {
         return db.client.findMany({
            where: {
               societe_id,
               OR: [
                  { nom: { contains: searchWord } },
                  { NIF: { contains: searchWord } },
               ],
            },
            orderBy: { updateAt: 'desc' },
         })
      }
   } else {
      return []
   }
}
