'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import {
   entree_stock_schema,
   inventaire_stock_schema,
   sortie_stock_schema,
} from '@/schemas'

import { url } from '@/helpers/url'
import { z } from 'zod'
import { login_credential_only } from './login'
import {
   ebms_mouvement_stock_schema,
   ebms_movement_result_schema,
} from './schema'

export const ebms_add_stock_movement = async (
   values: z.infer<typeof ebms_mouvement_stock_schema>,
) => {
   const validateField = ebms_mouvement_stock_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const societe = await db.societe.findFirst({
         where: { identifiant_system: valideData.system_or_device_id },
      })
      if (societe) {
         const tokenObject = await login_credential_only(
            societe.identifiant_system,
            societe.mot_de_passe_system,
         )
         if (tokenObject.success) {
            try {
               const {
                  system_or_device_id,
                  item_code,
                  item_designation,
                  item_quantity,
                  item_cost_price_currency,
                  item_measurement_unit,
                  item_cost_price,
                  item_movement_type,
                  item_movement_date,
                  item_movement_invoice_ref,
                  item_movement_description,
               } = valideData
               const res = await fetch(url + 'AddStockMovement', {
                  headers: {
                     Authorization: 'Bearer ' + tokenObject.result.token,
                  },
                  method: 'post',
                  body: JSON.stringify({
                     system_or_device_id,
                     item_code,
                     item_designation,
                     item_quantity,
                     item_cost_price_currency,
                     item_measurement_unit,
                     item_cost_price,
                     item_movement_type,
                     item_movement_date,
                     item_movement_invoice_ref,
                     item_movement_description,
                  }),
                  cache: 'no-store',
               })

               if (res.ok) {
                  const data: z.infer<typeof ebms_movement_result_schema> =
                     await res.json()
                  await db.mouvementStock.update({
                     data: { envoyer_obr: true },
                     where: { id: valideData.mouvement_id },
                  })
                  await db.logOBR.create({
                     data: {
                        lien: 'AddStockMovement',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: '',
                        societe_id: societe.id,
                     },
                  })

                  return data
               } else {
                  const data: z.infer<typeof ebms_movement_result_schema> =
                     await res.json()
                  await db.logOBR.create({
                     data: {
                        lien: 'AddStockMovement',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: '',
                        societe_id: societe.id,
                     },
                  })

                  return data
               }
            } catch (e) {
               const data: z.infer<typeof ebms_movement_result_schema> = {
                  success: false,
                  msg: "vous n'etez pas connecté à internet",
               }
               return data
            }
         } else {
            if (tokenObject.status) {
               const societe_id = await getSocieteId()
               if (societe_id) {
                  await db.logOBR.create({
                     data: {
                        lien: 'login',
                        methode: 'post',
                        code_reponse: tokenObject.status,
                        message_reponse: tokenObject.msg,
                        result: '',
                        societe_id,
                     },
                  })
               }
               const resultat: z.infer<typeof ebms_movement_result_schema> = {
                  success: tokenObject.success,
                  msg: tokenObject.msg,
               }
               return resultat
            } else {
               const resultat: z.infer<typeof ebms_movement_result_schema> = {
                  success: tokenObject.success,
                  msg: tokenObject.msg,
               }
               return resultat
            }
         }
      } else {
         return {
            success: false,
            msg: "une erreur s'est produit lors de la recuperationde la société",
         }
      }
   } else {
      return {
         success: false,
         msg: 'Les données envoyent ne sont pas valide. Veuillez réessayer!',
      }
   }
}
//entree sans ref facture
export const entree_stock_action = async (
   values: z.infer<typeof entree_stock_schema>,
   ref: number | undefined,
) => {
   const validateField = entree_stock_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const societe_id = await getSocieteId()
      if (societe_id) {
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            try {
               const produit = await db.produit.findUnique({
                  where: { id: valideData.produit_id },
               })
               if (produit) {
                  const nouvelle_quantite =
                     valideData.quantite + produit.stock_actuel
                  await db.produit.update({
                     data: { stock_actuel: nouvelle_quantite },
                     where: { id: produit.id },
                  })
                  await db.mouvementStock.create({
                     data: {
                        mouv_id_system: societe.identifiant_system,
                        produit_id: valideData.produit_id,
                        unite_mesure_id: produit.uniteId,
                        quantite: valideData.quantite,
                        prix_revien: valideData.prix_achat,
                        type_mouvement: valideData.type_mouvement,
                        facture_reference_id: ref,
                        motif: valideData.motif,
                        societe_id,
                     },
                  })
                  await auto_send_mouvement()
                  return {
                     success: true,
                     msg: 'Le mouvement a été enregistrer',
                  }
               } else {
                  return {
                     success: false,
                     msg: "une erreur s'est produit lors de la recuperation du produit",
                  }
               }
            } catch (e) {
               return {
                  success: false,
                  msg: "une innattendu s'est produit",
               }
            }
         } else {
            return {
               success: false,
               msg: "une erreur c'est produit lors de la recuperation de la société.",
            }
         }
      } else {
         return {
            success: false,
            msg: "une erreur c'est produit lors de la recuperation de la société.",
         }
      }
   } else {
      return { success: false, msg: "Le formulaire n'est pas valide" }
   }
}
//sortie sans ref facture
export const sortie_stock_action = async (
   values: z.infer<typeof sortie_stock_schema>,
   ref: number | undefined,
) => {
   const validateField = sortie_stock_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const societe_id = await getSocieteId()
      if (societe_id) {
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            try {
               const produit = await db.produit.findUnique({
                  where: { id: valideData.produit_id },
               })
               if (produit) {
                  if (valideData.quantite > produit.stock_actuel) {
                     return {
                        success: false,
                        msg:
                           'La quantite doit être inferieur ou égale à la quantité disponible en stock qui est de ' +
                           produit.stock_actuel,
                     }
                  } else {
                     const nouvelle_quantite =
                        produit.stock_actuel - valideData.quantite
                     await db.produit.update({
                        data: { stock_actuel: nouvelle_quantite },
                        where: { id: produit.id },
                     })
                     await db.mouvementStock.create({
                        data: {
                           mouv_id_system: societe.identifiant_system,
                           produit_id: valideData.produit_id,
                           unite_mesure_id: produit.uniteId,
                           quantite: valideData.quantite,
                           prix_revien: valideData.prix_achat,
                           type_mouvement: valideData.type_mouvement,
                           motif: valideData.motif,
                           facture_reference_id: ref,
                           societe_id,
                        },
                     })
                     await auto_send_mouvement()
                     return {
                        success: true,
                        msg: 'Le mouvement a été enregistrer',
                     }
                  }
               } else {
                  return {
                     success: false,
                     msg: "une erreur s'est produit lors de la recuperation du produit",
                  }
               }
            } catch (e) {
               return {
                  success: false,
                  msg: "une innattendu s'est produit",
               }
            }
         } else {
            return {
               success: false,
               msg: "une erreur c'est produit lors de la recuperation de la société.",
            }
         }
      } else {
         return {
            success: false,
            msg: "une erreur c'est produit lors de la recuperation de la société.",
         }
      }
   } else {
      return {
         success: false,
         msg: "Le formulaire n'est pas valide",
      }
   }
}
export const inventaire_stock_action = async (
   values: z.infer<typeof inventaire_stock_schema>,
   ref: number | undefined,
) => {
   const validateField = inventaire_stock_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const societe_id = await getSocieteId()
      if (societe_id) {
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            try {
               const produit = await db.produit.findUnique({
                  where: { id: valideData.produit_id },
               })
               if (produit) {
                  const nouvelle_quantite = valideData.quantite
                  await db.produit.update({
                     data: { stock_actuel: nouvelle_quantite },
                     where: { id: produit.id },
                  })
                  await db.mouvementStock.create({
                     data: {
                        mouv_id_system: societe.identifiant_system,
                        produit_id: valideData.produit_id,
                        unite_mesure_id: produit.uniteId,
                        quantite: valideData.quantite,
                        prix_revien: valideData.prix_achat,
                        type_mouvement: 'EI',
                        motif: valideData.motif,
                        facture_reference_id: ref,
                        societe_id,
                     },
                  })
                  await auto_send_mouvement()
                  return {
                     success: true,
                     msg: 'Le mouvement a été enregistrer',
                  }
               } else {
                  return {
                     success: false,
                     msg: "une erreur s'est produit lors de la recuperation du produit",
                  }
               }
            } catch (e) {
               return {
                  success: false,
                  msg: "une innattendu s'est produit",
               }
            }
         } else {
            return {
               success: false,
               msg: "une erreur c'est produit lors de la recuperation de la société.",
            }
         }
      } else {
         return {
            success: false,
            msg: "une erreur c'est produit lors de la recuperation de la société.",
         }
      }
   } else {
      return {
         success: false,
         msg:
            "Le formulaire n'est pas valide" +
            JSON.stringify(inventaire_stock_schema.safeParse(values)),
      }
   }
}
export const get_non_send_to_obr_mouvement = async () => {
   return db.mouvementStock.findMany({
      where: { envoyer_obr: false, activer: true },
      include: { facture: true },
   })
}
export const auto_send_mouvement = async () => {
   const mouvement_en_attente = await get_non_send_to_obr_mouvement()
   mouvement_en_attente.forEach(async (mouvement) => {
      const produit = await db.produit.findUnique({
         where: { id: mouvement.produit_id },
      })
      const unite_mesure = await db.uniteMesure.findUnique({
         where: { id: mouvement.unite_mesure_id },
      })
      if (produit && unite_mesure) {
         await ebms_add_stock_movement({
            mouvement_id: mouvement.id,
            system_or_device_id: mouvement.mouv_id_system,
            item_code: mouvement.produit_id,
            item_designation: produit.nom,
            item_cost_price: produit.prix_unitaire_revien.toString(),
            item_cost_price_currency: 'BIF',
            item_measurement_unit: unite_mesure.libelle,
            item_movement_description: mouvement.motif ? mouvement.motif : '',
            item_movement_invoice_ref: mouvement.facture?.numero_facture
               ? mouvement.facture.numero_facture
               : '',
            item_movement_date: mouvement.createAt
               .toISOString()
               .split('.')[0]
               .replace('T', ' '),
            item_movement_type: mouvement.type_mouvement,
            item_quantity: mouvement.quantite,
         })
      } else {
         //nothing
      }
   })
}
export const get_stock_mouvement_entree = async () => {
   return db.mouvementStock.findMany({
      include: { produit: true, facture: true, unite_mesure: true },
      where: {
         OR: [
            { type_mouvement: 'EN' },
            { type_mouvement: 'EAJ' },
            { type_mouvement: 'EAU' },
            { type_mouvement: 'ER' },
            { type_mouvement: 'ET' },
         ],
      },
      orderBy: { updateAt: 'desc' },
   })
}
export const get_stock_mouvement_by_produit = async (id_produit: number) => {
   return db.mouvementStock.findMany({
      include: { produit: true, facture: true, unite_mesure: true },
      where: {
         produit_id: id_produit,
      },
      orderBy: { updateAt: 'desc' },
   })
}
export const get_stock_mouvement_sortie = async () => {
   return db.mouvementStock.findMany({
      include: { produit: true, facture: true, unite_mesure: true },
      where: {
         OR: [
            { type_mouvement: 'SAJ' },
            { type_mouvement: 'SAU' },
            { type_mouvement: 'SC' },
            { type_mouvement: 'SD' },
            { type_mouvement: 'SN' },
            { type_mouvement: 'SV' },
            { type_mouvement: 'SP' },
         ],
      },
      orderBy: { updateAt: 'desc' },
   })
}
export const get_stock_mouvement_inventaire = async () => {
   return db.mouvementStock.findMany({
      include: { produit: true, facture: true, unite_mesure: true },
      where: {
         OR: [{ type_mouvement: 'EI' }],
      },
      orderBy: { updateAt: 'desc' },
   })
}
export const get_all_stock_mouvement_by_product_id_action = async (
   produit_id: number,
) => {
   return db.mouvementStock.findMany({
      include: { produit: true, facture: true, unite_mesure: true },
      where: { produit_id },
   })
}
