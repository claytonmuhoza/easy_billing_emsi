'use server'

import { tout_taxe_comprise_prix } from '@/app/(dashboard)/_components/util_javascript'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { url } from '@/helpers/url'
import {
   detail_facture_form_schema,
   etape_1_facture_form_schema,
   format_facture_obr_schema,
   invoice_item,
} from '@/schemas'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { auto_send_action } from './auto_send'
import { login_credential_only } from './ebms/login'

import { arrondir_fbu } from '@/app/(dashboard)/_components/util_javascript'
import {
   ebms_add_facture_result,
   ebms_annuler_facture_result_schema,
   ebms_annuler_facture_schema,
} from './ebms/schema'
const detailFactureIncludes =
   Prisma.validator<Prisma.DetailFactureDefaultArgs>()({
      include: { produit: true, facture: true },
   })
type DetailFactureProduit = Prisma.DetailFactureGetPayload<
   typeof detailFactureIncludes
>
export const get_detail_facture_action = async (id_facture: number) => {
   return await db.detailFacture.findMany({
      where: { facture_id: id_facture },
      include: { facture: true, produit: true },
   })
}
export const create_facture_normale = async (
   values: z.infer<typeof etape_1_facture_form_schema>,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validateField = etape_1_facture_form_schema.safeParse(values)
      if (validateField.success) {
         const valideData = validateField.data
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            const client = await db.client.findUnique({
               where: { id: valideData.client_id },
            })
            if (client) {
               try {
                  let taux_de_change = undefined
                  if (
                     valideData.devise === 'EUR' ||
                     valideData.devise === 'USD'
                  ) {
                     taux_de_change = 1
                  }
                  const facture = await db.facture.create({
                     data: {
                        client_id: client.id,
                        devise: valideData.devise.toString(),
                        taux_devise: taux_de_change,
                        banque_id: valideData.banque_id,
                        ModePaiement: valideData.type_paiement.toString(),
                        societe_id,
                        type_facture: 'FN',
                     },
                     include: {
                        client: true,
                        details_facture: true,
                        banque: true,
                        societe: true,
                     },
                  })
                  return {
                     success: true,
                     msg: 'facture cree avec succès',
                     facture: facture,
                  }
               } catch (e) {
                  return {
                     success: false,
                     msg: "Une erreur s'est produit coté serveur",
                  }
               }
            } else {
               return {
                  success: false,
                  msg: "une erreur s'est produit lors de la récupération du client",
               }
            }
         } else {
            return {
               success: false,
               msg: "Une erreur s'est produit lors de la recuperation des informations du vendeur",
            }
         }
      } else {
         return {
            success: false,
            msg:
               'Le formulaire est nom valide ' +
               JSON.stringify(validateField.error),
         }
      }
   } else {
      return {
         success: false,
         msg: 'impossible de trouvé la société du vendeur',
      }
   }
}
export const update_facture_normale = async (
   values: z.infer<typeof etape_1_facture_form_schema>,
   id_facture: number,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const validateField = etape_1_facture_form_schema.safeParse(values)
      if (validateField.success) {
         const valideData = validateField.data
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            const client = await db.client.findUnique({
               where: { id: valideData.client_id },
            })
            if (client) {
               try {
                  let taux_de_change = undefined
                  if (
                     valideData.devise == 'EUR' ||
                     valideData.devise === 'USD'
                  ) {
                     taux_de_change = 1
                  }
                  const facture = await db.facture.update({
                     data: {
                        client_id: client.id,
                        devise: valideData.devise.toString(),
                        taux_devise: taux_de_change,
                        banque_id: valideData.banque_id,
                        ModePaiement: valideData.type_paiement.toString(),
                        societe_id,
                        type_facture: 'FN',
                     },
                     include: {
                        client: true,
                        details_facture: true,
                        banque: true,
                        societe: true,
                     },
                     where: { id: id_facture },
                  })
                  return {
                     success: true,
                     msg: 'facture cree avec succès',
                     facture: facture,
                  }
               } catch (e) {
                  return {
                     success: false,
                     msg: "Une erreur s'est produit coté serveur",
                  }
               }
            } else {
               return {
                  success: false,
                  msg: "une erreur s'est produit lors de la récupération du client",
               }
            }
         } else {
            return {
               success: false,
               msg: "Une erreur s'est produit lors de la recuperation des informations du vendeur",
            }
         }
      } else {
         return {
            success: false,
            msg:
               'Le formulaire est nom valide ' +
               JSON.stringify(validateField.error),
         }
      }
   } else {
      return {
         success: false,
         msg: 'impossible de trouvé la société du vendeur',
      }
   }
}
export const get_all_FN_en_cours = async (search_term?: string) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      if (search_term) {
         return await db.facture.findMany({
            where: {
               type_facture: 'FN',
               etat_facture: 'non_validee',

               OR: [
                  { client: { nom: { contains: search_term } } },
                  { numero_facture: { contains: search_term } },
                  { client: { NIF: { contains: search_term } } },
               ],
            },
            orderBy: { createAt: 'desc' },

            include: {
               banque: true,
               client: true,
               details_facture: true,
               societe: true,
            },
         })
      } else {
         return await db.facture.findMany({
            where: {
               type_facture: 'FN',
               etat_facture: 'non_validee',

               OR: [
                  { client: { nom: { contains: search_term } } },
                  { numero_facture: { contains: search_term } },
                  { client: { NIF: { contains: search_term } } },
               ],
            },
            orderBy: { createAt: 'desc' },

            include: {
               banque: true,
               client: true,
               details_facture: true,
               societe: true,
            },
         })
      }
   } else {
      return []
   }
}
export const get_all_FN = async (search_term?: string) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      if (search_term) {
         return await db.facture.findMany({
            where: {
               type_facture: 'FN',
               OR: [
                  {
                     etat_facture: 'validee',
                     OR: [
                        { client: { nom: { contains: search_term } } },
                        { client: { NIF: { contains: search_term } } },
                        { numero_facture: { contains: search_term } },
                     ],
                  },
                  {
                     etat_facture: 'annuler',
                     OR: [
                        { client: { nom: { contains: search_term } } },
                        { client: { NIF: { contains: search_term } } },
                        { numero_facture: { contains: search_term } },
                     ],
                  },
               ],
            },
            orderBy: { date_paiement: 'desc' },
            include: {
               banque: true,
               client: true,
               details_facture: true,
               societe: true,
            },
         })
      } else {
         return await db.facture.findMany({
            where: {
               type_facture: 'FN',
               OR: [{ etat_facture: 'validee' }, { etat_facture: 'annuler' }],
            },
            orderBy: { date_paiement: 'desc' },
            include: {
               banque: true,
               client: true,
               details_facture: true,
               societe: true,
            },
         })
      }
   } else {
      return []
   }
}
export const add_details_facture = async (
   values: z.infer<typeof detail_facture_form_schema>,
) => {
   const validateField = detail_facture_form_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const product = await db.produit.findUnique({
         where: { id: valideData.produit_id },
      })
      if (product) {
         if (product.stockable && valideData.quantite > product.stock_actuel) {
            return {
               success: false,
               msg:
                  "La quantité n'est pas disponible en stock qui est de " +
                  product.stock_actuel,
            }
         }
         const prix_vente_unitaire = tout_taxe_comprise_prix
            ? valideData.prix_vente_ttc
            : valideData.prix_vente_ttc +
              valideData.prix_vente_ttc * (product.tva / 100)
         valideData.prix_vente_ttc = tout_taxe_comprise_prix
            ? (valideData.prix_vente_ttc * 100) / (100 + product.tva)
            : valideData.prix_vente_ttc
         //faire calcul tva,
         const calculTva = valideData.prix_vente_ttc * (product.tva / 100)

         // faire calcul prix de vente hors tva
         // const calcul_prix_vente_hors_tva =
         //    valideData.prix_vente_ttc - calculTva
         //faire calcul taxe de consomation
         const calcul_taxe_de_consomation =
            valideData.prix_vente_ttc * (product.taxe_consomation / 100)
         try {
            const detail_facture = await db.detailFacture.create({
               data: {
                  facture_id: valideData.facture_id,
                  produit_id: arrondir_fbu(valideData.produit_id),
                  prix_vente_unitaire: arrondir_fbu(prix_vente_unitaire),
                  prix_unitaire_tva: calculTva,
                  taxe_consomation: arrondir_fbu(calcul_taxe_de_consomation),
                  prix_unitaire_vente_hors_tva: valideData.prix_vente_ttc,

                  quantite: valideData.quantite,
               },
               include: { facture: true },
            })
            if (product.stockable) {
               await db.produit.update({
                  data: {
                     stock_actuel: product.stock_actuel - valideData.quantite,
                  },
                  where: { id: product.id },
               })
            }
            const facture = await db.facture.findUnique({
               include: {
                  banque: true,
                  details_facture: true,
                  client: true,
                  societe: true,
               },
               where: { id: detail_facture.facture_id },
            })
            return {
               success: true,
               msg: 'Le detail a été ajouté avec succès',
               result: facture,
            }
         } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
               if (e.code === 'P2002') {
                  return {
                     success: false,
                     msg: 'Le produit existe déjà sur la facture',
                  }
               }
            }
            return {
               success: false,
               msg: "Une erreur s'est produit lors de l'ajout du produit à la facture",
            }
         }
      } else {
         return {
            success: false,
            msg: "Une erreur s'est produit lors de la recuperation du produit dans la base de donnée",
         }
      }
      //await db.detailFacture.create({ data: {} })
   } else {
      return { success: false, msg: "Le formulaire n'est pas valide" }
   }
}
export const supprimer_details_facture = async (id_detail_facture: number) => {
   const detailFacture = await db.detailFacture.findUnique({
      where: { id: id_detail_facture },
      include: { produit: true },
   })
   if (detailFacture) {
      const product = await db.produit.findUnique({
         where: {
            id: detailFacture.produit.id,
         },
      })
      if (product) {
         try {
            if (product.stockable) {
               await db.produit.update({
                  data: {
                     stock_actuel:
                        product.stock_actuel + detailFacture.quantite,
                  },
                  where: { id: product.id },
               })
            }
            await db.detailFacture.delete({
               where: { id: id_detail_facture },
            })

            return {
               success: true,
               msg: 'Le detail a été supprimé avec succès',
            }
         } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
               if (e.code === 'P2002') {
                  return {
                     success: false,
                     msg: 'Le produit existe déjà sur la facture',
                  }
               }
            }
            return {
               success: false,
               msg: "Une erreur s'est produit lors de l'ajout du produit à la facture",
            }
         }
      } else {
         return {
            success: false,
            msg: "Une erreur s'est produit lors de la recuperation du produit dans la base de donnée",
         }
      }
   }
   //await db.detailFacture.create({ data: {} })
}
export const supprimer_facture = async (id_facture: number) => {
   const facture = await db.facture.findUnique({
      where: { id: id_facture },
      include: { details_facture: true },
   })
   if (facture) {
      if (facture.etat_facture === 'non_validee') {
         for (const detail of facture.details_facture) {
            await supprimer_details_facture(detail.id)
         }
         await db.facture.delete({ where: { id: id_facture } })
         return {
            data: { success: true, msg: 'La facture a été supprimé' },
         }
      } else {
         return {
            data: {
               success: false,
               msg: "La facture n'a pas été supprimé parce qu'elle est dans un etat validé ou annulé",
            },
         }
      }
   } else {
      return {
         data: {
            success: false,
            msg: "La facture n'a pas été trouvé dans la base de donnée",
         },
      }
   }
}
export const modifier_details_facture = async (
   values: z.infer<typeof detail_facture_form_schema>,
   id_detail_facture: number,
) => {
   const validateField = detail_facture_form_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const detailFacture = await db.detailFacture.findUnique({
         where: { id: id_detail_facture },
      })
      const product = await db.produit.findUnique({
         where: { id: valideData.produit_id },
      })
      if (product && detailFacture) {
         if (
            product.stockable &&
            valideData.quantite > product.stock_actuel + detailFacture.quantite
         ) {
            const quantite_disponible =
               product.stock_actuel + detailFacture.quantite
            return {
               success: false,
               msg:
                  "La quantité n'est pas disponible en stock qui est de " +
                  quantite_disponible,
            }
         }
         //calcul prix unitaire
         const prix_vente_unitaire = tout_taxe_comprise_prix
            ? valideData.prix_vente_ttc
            : valideData.prix_vente_ttc +
              valideData.prix_vente_ttc * (product.tva / 100)
         valideData.prix_vente_ttc = tout_taxe_comprise_prix
            ? (valideData.prix_vente_ttc * 100) / (100 + product.tva)
            : valideData.prix_vente_ttc
         //faire calcul tva,
         const calculTva = valideData.prix_vente_ttc * (product.tva / 100)

         // faire calcul prix de vente hors tva
         // const calcul_prix_vente_hors_tva =
         //    valideData.prix_vente_ttc - calculTva
         //faire calcul taxe de consomation
         const calcul_taxe_de_consomation =
            valideData.prix_vente_ttc * (product.taxe_consomation / 100)
         try {
            const detail_facture = await db.detailFacture.update({
               data: {
                  facture_id: valideData.facture_id,
                  produit_id: arrondir_fbu(valideData.produit_id),
                  prix_vente_unitaire: arrondir_fbu(prix_vente_unitaire),
                  prix_unitaire_tva: calculTva,
                  taxe_consomation: arrondir_fbu(calcul_taxe_de_consomation),
                  prix_unitaire_vente_hors_tva: valideData.prix_vente_ttc,

                  quantite: valideData.quantite,
               },
               include: { facture: true },
               where: { id: id_detail_facture },
            })
            if (product.stockable) {
               await db.produit.update({
                  data: {
                     stock_actuel:
                        product.stock_actuel +
                        detailFacture.quantite -
                        valideData.quantite,
                  },
                  where: { id: product.id },
               })
            }
            const facture = await db.facture.findUnique({
               include: {
                  banque: true,
                  details_facture: true,
                  client: true,
                  societe: true,
               },
               where: { id: detail_facture.facture_id },
            })
            return {
               success: true,
               msg: 'Le detail a été ajouté avec succès',
               result: facture,
            }
         } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
               if (e.code === 'P2002') {
                  return {
                     success: false,
                     msg: 'Le produit existe déjà sur la facture',
                  }
               }
            }
            return {
               success: false,
               msg: "Une erreur s'est produit lors de l'ajout du produit à la facture",
            }
         }
      } else {
         return {
            success: false,
            msg: "Une erreur s'est produit lors de la recuperation du produit dans la base de donnée",
         }
      }
      //await db.detailFacture.create({ data: {} })
   } else {
      return { success: false, msg: "Le formulaire n'est pas valide" }
   }
}
export const get_numero_facture_normale_disponible = async () => {
   const today_year = new Date().getFullYear()
   const facture = await db.facture.aggregate({
      _count: { id: true },
      where: {
         date_paiement: {
            lte: new Date(today_year + '-12-31'),
            gte: new Date(today_year + '-01-01'),
         },
      },
   })
   let add_zero = ''
   if (facture._count.id < 9) {
      add_zero = '0'
   }

   return (
      'FN' +
      add_zero +
      '' +
      (today_year === 2024 ? facture._count.id + 1 : facture._count.id + 1) +
      '/' +
      today_year + '/geciva'
   )
}
export const addHours = (date: Date, hours: number) => {
   const hoursToAdd = hours * 60 * 60 * 1000
   date.setTime(date.getTime() + hoursToAdd)
   return date
}
export const get_numero_unique_facture_normale = async (date: Date) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const societe = await db.societe.findUnique({ where: { id: societe_id } })
      if (societe) {
         // const addedDate = addHours(nowdate, 2)
         // const date = new Date(addedDate)
         const numero_facture = await get_numero_facture_normale_disponible()
         const numero_unique: string =
            societe.nif +
            '/' +
            societe.identifiant_system +
            '/' +
            date
               .toISOString()
               .split('.')[0]
               .replace('T', '')
               .replaceAll('-', '')
               .replaceAll(':', '') +
            '/' +
            numero_facture
         return {
            success: true,
            msg: 'numero unique generer avec success',
            result: numero_unique,
         }
      } else {
         return {
            success: false,
            msg: "une erreur s'est produit lors de la recuperation du numero de la facture",
         }
      }
   } else {
      return {
         success: false,
         msg: "une erreur s'est produit lors de la recuperation du numero de la facture",
      }
   }
}
export const submit_validate_facture = async (id_facture: number) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const facture = await db.facture.findUnique({
         where: { id: id_facture },
         include: {
            details_facture: true,
            client: true,
            banque: true,
            societe: true,
         },
      })
      if (facture) {
         if (facture.details_facture.length === 0) {
            return {
               success: 'false',
               msg: "Vous ne pouvez pas valider une facture qui ne contient pas d'article",
            }
         } else {
            const date_today = new Date()
            date_today.setTime(date_today.getTime() + 2 * 60 * 60 * 1000)
            // console.log('today date:' + date_today)
            const numero_facture = await get_numero_facture_normale_disponible()
            const numero_unique =
               await get_numero_unique_facture_normale(date_today)
            if (numero_unique.success) {
               facture.details_facture.forEach((element) => {
                  sortie_stock_sur_facture_action(
                     element.produit_id,
                     element.quantite,
                     facture.id,
                  )
               })
               const facture_updated = await db.facture.update({
                  data: {
                     numero_facture,
                     date_paiement: date_today,
                     numero_unique_facture: numero_unique.result,
                     etat_facture: 'validee',
                     sended_to_obr: false,
                  },
                  include: {
                     client: true,
                     banque: true,
                     societe: true,
                     details_facture: true,
                  },
                  where: { id: facture.id },
               })
               return {
                  success: true,
                  msg: 'la facture a été ajouter avec succès',
                  result: facture_updated,
               }
            }
         }
      } else {
         return {
            success: false,
            msg: "Une erreur s'est produit lors de la recuperation de la facture",
         }
      }
   } else {
      return {
         success: false,
         msg: "une erreur s'est produit lors de la recuperation du numero de la facture",
      }
   }
}
const sortie_stock_sur_facture_action = async (
   produit_id: number,
   quantite: number,
   ref: number | undefined,
   numero_facture?: string,
) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const societe = await db.societe.findUnique({
         where: { id: societe_id },
      })
      if (societe) {
         try {
            const produit = await db.produit.findUnique({
               where: { id: produit_id },
            })
            if (produit) {
               if (produit.stockable) {
                  await db.mouvementStock.create({
                     data: {
                        mouv_id_system: societe.identifiant_system,
                        produit_id: produit_id,
                        unite_mesure_id: produit.uniteId,
                        quantite: quantite,
                        prix_revien: produit.prix_unitaire_revien,
                        type_mouvement: 'SN',
                        facture_reference_id: ref,
                        motif: numero_facture
                           ? 'vente sur facture normale numéro ' +
                             numero_facture
                           : 'vente sur facture normale',
                        societe_id,
                     },
                  })
                  //await auto_send_mouvement()
               }
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
}
export const valide_format_facture = async (facture_id: number) => {
   const facture = await db.facture.findUnique({
      where: { id: facture_id },
      include: {
         client: true,
         details_facture: { include: { produit: true } },
         banque: true,
         societe: true,
      },
   })
   if (facture) {
      const items: z.infer<typeof invoice_item>[] = []

      for (const item of facture.details_facture) {
         items.push({
            item_designation: item.produit.nom,
            item_price: arrondir_fbu(item.prix_unitaire_vente_hors_tva),
            item_price_wvat: arrondir_fbu(
               (item.prix_unitaire_vente_hors_tva + item.prix_unitaire_tva) *
                  item.quantite,
            ),
            item_quantity: item.quantite,
            item_ct: arrondir_fbu(item.taxe_consomation),
            item_tl: 0,
            item_ott_tax: 0,
            item_tsce_tax: 0,
            item_price_nvat: arrondir_fbu(
               item.prix_unitaire_vente_hors_tva * item.quantite,
            ),
            item_total_amount: arrondir_fbu(
               (item.prix_unitaire_vente_hors_tva + item.prix_unitaire_tva) *
                  item.quantite,
            ),
            vat: arrondir_fbu(item.prix_unitaire_tva * item.quantite),
         })
      }
      if (facture.date_paiement && facture.numero_facture) {
         console.log(
            facture.date_paiement.toISOString().split('.')[0].replace('T', ' '),
         )

         const formated_facture: z.infer<typeof format_facture_obr_schema> = {
            invoice_number: facture.numero_facture,
            invoice_date: facture.date_paiement
               .toISOString()
               .split('.')[0]
               .replace('T', ' '),
            invoice_type: facture.type_facture,
            tp_name: facture.societe.nom,
            tp_TIN: facture.societe.nif,
            tp_type: facture.societe.type_societe,
            tp_trade_number: facture.societe.rc ? facture.societe.rc : '',
            tp_postal_number: facture.societe.bp ? facture.societe.bp : '',
            tp_address_province: facture.societe.adresse_province,
            tp_address_quartier: facture.societe.adresse_quartier,
            tp_address_commune: facture.societe.adresse_commune,
            tp_address_avenue: facture.societe.adresse_avenue,
            tp_address_number: facture.societe.adresse_numero
               ? facture.societe.adresse_numero
               : '',
            vat_taxpayer: facture.societe.tva ? '1' : '0',
            ct_taxpayer: facture.societe.tc ? '1' : '0',
            tl_taxpayer: '0',
            tp_fiscal_center: facture.societe.direction_fiscale,
            tp_activity_sector: facture.societe.secteur_activite,
            tp_legal_form: facture.societe.forme_juridique,
            payment_type: facture.ModePaiement,
            invoice_currency: facture.devise,
            customer_name: facture.client.nom,
            customer_TIN: facture.client.NIF ? facture.client.NIF : '',
            customer_adress: facture.client.adresse,
            cancelled_invoice_ref: facture.numero_facture_reference
               ? facture.numero_facture_reference
               : '',
            cancelled_invoice: 'N',
            invoice_ref: facture.numero_facture_reference
               ? facture.numero_facture_reference
               : '',
            cn_motif: facture.facture_motif ? facture.facture_motif : '',
            invoice_identifier: facture.numero_unique_facture
               ? facture.numero_unique_facture
               : '',
            vat_customer_payer: facture.client.assujetti_tva ? '1' : '0',
            invoice_items: items,
         }
         return {
            success: true,
            msg: 'facture formater avec succès',
            result: formated_facture,
            identifiant: {
               username: facture.societe.identifiant_system,
               password: facture.societe.mot_de_passe_system,
            },
         }
      } else {
         return { success: false, msg: "la facture n'est pas valide" }
      }
   } else {
      return {
         success: false,
         result: facture,
         msg: "une erreur s'est produit lors de la recuperation de la facture",
      }
   }
}
export const get_facture_non_sended_to_obr = async () => {
   return await db.facture.findMany({
      include: { societe: true },
      where: {
         OR: [
            { etat_facture: 'annuler', sended_to_obr: false },
            { etat_facture: 'validee', sended_to_obr: false },
         ],
      },
   })
}
export const ebms_add_facture = async (
   values: z.infer<typeof format_facture_obr_schema>,
   identifiant_system: string,
   facture_id: number,
) => {
   const validateField = format_facture_obr_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const societe = await db.societe.findFirst({
         where: { identifiant_system },
      })
      if (societe) {
         const tokenObject = await login_credential_only(
            societe.identifiant_system,
            societe.mot_de_passe_system,
         )
         if (tokenObject.success) {
            try {
               const res = await fetch(url + 'addInvoice_confirm', {
                  headers: {
                     Authorization: 'Bearer ' + tokenObject.result.token,
                  },
                  method: 'post',
                  body: JSON.stringify(valideData),
                  cache: 'no-store',
               })

               if (res.ok) {
                  const data: z.infer<typeof ebms_add_facture_result> =
                     await res.json()
                  await db.logOBR.create({
                     data: {
                        lien: 'addInvoice_confirm',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: JSON.stringify(data.result),
                        societe_id: societe.id,
                     },
                  })
                  await db.facture.update({
                     data: { sended_to_obr: true },
                     where: { id: facture_id },
                  })
                  return data
               } else {
                  const data: z.infer<typeof ebms_add_facture_result> =
                     await res.json()
                  await db.logOBR.create({
                     data: {
                        lien: 'addInvoice_confirm',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: '',
                        societe_id: societe.id,
                     },
                  })
                  if (res.status === 409) {
                     await db.facture.update({
                        data: { sended_to_obr: true },
                        where: { id: facture_id },
                     })
                  }

                  return data
               }
            } catch (e) {
               const data: z.infer<typeof ebms_add_facture_result> = {
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
               const resultat: z.infer<typeof ebms_add_facture_result> = {
                  success: tokenObject.success,
                  msg: tokenObject.msg,
               }
               return resultat
            } else {
               const resultat: z.infer<typeof ebms_add_facture_result> = {
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
export const auto_send_facture_obr = async () => {
   const facture = await get_facture_non_sended_to_obr()
   facture.forEach(async (element) => {
      const valide_data = await valide_format_facture(element.id)
      if (valide_data.success && valide_data.result) {
         ebms_add_facture(
            valide_data.result,
            valide_data.identifiant?.username,
            element.id,
         )
      }
   })
}
export const annulation_facture_action = async (
   facture_id: number,
   motif: string,
) => {
   const facture = await db.facture.findUnique({
      where: { id: facture_id },
      include: { societe: true, banque: true, details_facture: true },
   })
   await db.facture.update({
      data: { facture_motif: motif },
      where: { id: facture_id },
   })
   if (facture) {
      if (facture.etat_facture === 'validee') {
         const dtl_fact = await db.detailFacture.findMany({
            include: { facture: true, produit: true },
            where: { facture_id: facture.id },
         })
         for (const detail_facture of dtl_fact) {
            add_annuler_detail_facture(
               detail_facture,
               facture.societe.identifiant_system,
            )
         }
         await db.facture.update({
            data: { etat_facture: 'annuler', annulation_send_to_obr: false },
            where: { id: facture.id },
         })
         await auto_send_action()
         return { success: true, msg: 'La facture a été annuler avec succès' }
      } else {
         return {
            success: false,
            msg: "La facture n'est pas dans un etat valide",
         }
      }
   } else {
      return {
         success: false,
         msg: "Une erreur s'est produit lors de la récupération de la facture",
      }
   }
}
const add_annuler_detail_facture = async (
   detailFacture: DetailFactureProduit,
   id_system: string,
) => {
   if (detailFacture.produit.stockable) {
      await db.produit.update({
         data: {
            stock_actuel:
               detailFacture.produit.stock_actuel + detailFacture.quantite,
         },
         where: {
            id: detailFacture.produit.id,
         },
      })
      await db.mouvementStock.create({
         data: {
            mouv_id_system: id_system,
            type_mouvement: 'ER',
            quantite: detailFacture.quantite,
            unite_mesure_id: detailFacture.produit.uniteId,
            prix_revien: detailFacture.produit.prix_unitaire_revien,
            produit_id: detailFacture.produit_id,
            societe_id: detailFacture.facture.societe_id,
            facture_reference_id: detailFacture.facture.id,
            motif:
               'Annulation facture numéro ' +
               detailFacture.facture.numero_facture,
         },
      })
   }
}
const get_all_not_send_facture_annuler = async () => {
   return db.facture.findMany({
      where: { etat_facture: 'annuler', annulation_send_to_obr: false },
   })
}
export const auto_send_facture_annuler = async () => {
   const factures_annuler = await get_all_not_send_facture_annuler()
   for (const facture_annuler of factures_annuler) {
      if (facture_annuler.sended_to_obr) {
         console.log(
            facture_annuler.numero_unique_facture,
            await ebms_annule_facture({
               invoice_identifier: facture_annuler.numero_unique_facture
                  ? facture_annuler.numero_unique_facture
                  : '',
               cn_motif: facture_annuler.facture_motif
                  ? facture_annuler.facture_motif
                  : '',
            }),
         )
      } else {
         await auto_send_facture_obr()
      }
   }
}
const ebms_annule_facture = async (
   values: z.infer<typeof ebms_annuler_facture_schema>,
) => {
   const validateField = ebms_annuler_facture_schema.safeParse(values)
   if (validateField.success) {
      const valideData = validateField.data
      const facture = await db.facture.findFirst({
         include: { societe: true },
         where: { numero_unique_facture: valideData.invoice_identifier },
      })
      if (facture) {
         const tokenObject = await login_credential_only(
            facture.societe.identifiant_system,
            facture.societe.mot_de_passe_system,
         )
         if (tokenObject.success) {
            try {
               const res = await fetch(url + 'cancelInvoice', {
                  headers: {
                     Authorization: 'Bearer ' + tokenObject.result.token,
                  },
                  method: 'post',
                  body: JSON.stringify(valideData),
                  cache: 'no-store',
               })

               if (res.ok) {
                  const data: z.infer<
                     typeof ebms_annuler_facture_result_schema
                  > = await res.json()
                  await db.logOBR.create({
                     data: {
                        lien: 'cancelInvoice',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: '',
                        societe_id: facture.societe.id,
                     },
                  })
                  await db.facture.update({
                     data: { annulation_send_to_obr: true },
                     where: {
                        id: facture.id,
                     },
                  })
                  return data
               } else {
                  const data: z.infer<
                     typeof ebms_annuler_facture_result_schema
                  > = await res.json()
                  await db.logOBR.create({
                     data: {
                        lien: 'cancelInvoice',
                        methode: 'post',
                        code_reponse: res.status,
                        message_reponse: data.msg,
                        result: '',
                        societe_id: facture.societe.id,
                     },
                  })

                  return data
               }
            } catch (e) {
               const data: z.infer<typeof ebms_annuler_facture_result_schema> =
                  {
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
               const resultat: z.infer<
                  typeof ebms_annuler_facture_result_schema
               > = {
                  success: tokenObject.success,
                  msg: tokenObject.msg,
               }
               return resultat
            } else {
               const resultat: z.infer<
                  typeof ebms_annuler_facture_result_schema
               > = {
                  success: tokenObject.success,
                  msg: tokenObject.msg,
               }
               return resultat
            }
         }
      } else {
         const result: z.infer<typeof ebms_annuler_facture_result_schema> = {
            success: false,
            msg: "une erreur s'est produit lors de la recuperationde de la facture",
         }
         return result
      }
   } else {
      const result: z.infer<typeof ebms_annuler_facture_result_schema> = {
         success: false,
         msg: 'Les données envoyent ne sont pas valide. Veuillez réessayer!',
      }
      return result
   }
}
