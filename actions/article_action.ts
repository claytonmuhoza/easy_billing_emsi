'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { ArticleSchema } from '@/schemas'
import { z } from 'zod'
export const create_article_action = async (
   values: z.infer<typeof ArticleSchema>,
) => {
   const validateField = ArticleSchema.safeParse(values)
   if (!validateField.success) {
      return { error: "Le formulaire n'est pas valide. Veuillez réessayer!" }
   } else {
      const article_data = validateField.data
      const societe_id = await getSocieteId()
      if (article_data.stockable) {
         if (societe_id) {
            const existing_article = await db.produit.findUnique({
               where: { nom_societe_id: { nom: article_data.nom, societe_id } },
            })
            if (existing_article) {
               if (existing_article.activer) {
                  return { error: 'Le produit existe déjà!' }
               } else {
                  await db.produit.update({
                     data: {
                        nom: article_data.nom,
                        stockable: article_data.stockable,
                        prix_unitaire_revien: article_data.prix_revient,
                        stock_minimal_alerte: article_data.stock_minimal_alert,
                        prix_unitaire_vente_TTC: article_data.prix_vente,
                        tva: article_data.taux_tva,
                        categorieId: article_data.categorie_id,
                        uniteId: article_data.unite_mesure_id,
                        societe_id: societe_id,
                     },
                     where: {
                        nom_societe_id: { nom: article_data.nom, societe_id },
                     },
                  })
                  return {
                     sucess: 'Le produit a été creer avec success',
                     is_service: false,
                  }
               }
            } else {
               await db.produit.create({
                  data: {
                     nom: article_data.nom,
                     stockable: article_data.stockable,
                     prix_unitaire_revien: article_data.prix_revient,
                     stock_minimal_alerte: article_data.stock_minimal_alert,
                     prix_unitaire_vente_TTC: article_data.prix_vente,
                     tva: article_data.taux_tva,
                     categorieId: article_data.categorie_id,
                     uniteId: article_data.unite_mesure_id,
                     societe_id: societe_id,
                  },
               })
               return {
                  sucess: 'Le produit a été creer avec success',
                  is_service: false,
               }
            }
         } else {
            return {
               error: "un problème s'est produit lors de la recuperation de la société. Veuillez vous déconnectez puis vous reconnectez à nouveau",
            }
         }
      } else {
         if (societe_id) {
            try {
               const existing_article = await db.produit.findUnique({
                  where: {
                     nom_societe_id: { nom: article_data.nom, societe_id },
                  },
               })
               if (existing_article) {
                  if (existing_article.activer) {
                     return {
                        error: 'Un produit portant le même nom existe déjà',
                     }
                  } else {
                     await db.produit.update({
                        data: {
                           nom: article_data.nom,
                           stockable: article_data.stockable,
                           prix_unitaire_vente_TTC: article_data.prix_vente,
                           tva: article_data.taux_tva,
                           categorieId: article_data.categorie_id,
                           uniteId: article_data.unite_mesure_id,
                           societe_id: societe_id,
                           activer: true,
                        },
                        where: {
                           nom_societe_id: {
                              nom: article_data.nom,
                              societe_id,
                           },
                        },
                     })
                     return {
                        sucess: 'Le service a été creer avec success',
                        is_service: true,
                     }
                  }
               } else {
                  await db.produit.create({
                     data: {
                        nom: article_data.nom,
                        stockable: article_data.stockable,
                        tva: article_data.taux_tva,
                        prix_unitaire_vente_TTC: article_data.prix_vente,
                        categorieId: article_data.categorie_id,
                        uniteId: article_data.unite_mesure_id,
                        societe_id: societe_id,
                     },
                  })
                  return {
                     sucess: 'Le service a été creer avec success',
                     is_service: true,
                  }
               }
            } catch (e) {
               return {
                  error: 'Veuillez verifiez si tout les informations sont bien remplit puis réessayez!',
               }
            }
         } else {
            return {
               error: "un problème s'est produit lors de la recuperation de la société. Veuillez vous déconnectez puis vous reconnectez à nouveau",
            }
         }
      }
   }
}
export const update_article_action = async (
   values: z.infer<typeof ArticleSchema>,
   id_article: number,
) => {
   const validateField = ArticleSchema.safeParse(values)
   if (!validateField.success) {
      return { error: "Le formulaire n'est pas valide. Veuillez réessayer!" }
   } else {
      const article_data = validateField.data
      const societe_id = await getSocieteId()
      if (article_data.stockable) {
         if (societe_id) {
            const existing_article = await db.produit.findUnique({
               where: { nom_societe_id: { nom: article_data.nom, societe_id } },
            })
            if (existing_article && existing_article.id !== id_article) {
               return { error: 'Le produit existe déjà!' }
            } else {
               await db.produit.update({
                  data: {
                     nom: article_data.nom,
                     stockable: article_data.stockable,
                     prix_unitaire_revien: article_data.prix_revient,
                     stock_minimal_alerte: article_data.stock_minimal_alert,
                     prix_unitaire_vente_TTC: article_data.prix_vente,
                     tva: article_data.taux_tva,
                     categorieId: article_data.categorie_id,
                     uniteId: article_data.unite_mesure_id,
                     activer: true,
                     societe_id: societe_id,
                  },
                  where: {
                     id: id_article,
                  },
               })
               return {
                  sucess: 'Le produit a été creer avec success',
                  is_service: false,
               }
            }
         } else {
            return {
               error: "un problème s'est produit lors de la recuperation de la société. Veuillez vous déconnectez puis vous reconnectez à nouveau",
            }
         }
      } else {
         if (societe_id) {
            try {
               const existing_article = await db.produit.findUnique({
                  where: {
                     nom_societe_id: { nom: article_data.nom, societe_id },
                  },
               })
               if (existing_article) {
                  if (
                     existing_article.activer &&
                     existing_article.id !== id_article
                  ) {
                     return {
                        error: 'Un produit portant le même nom existe déjà',
                     }
                  } else {
                     await db.produit.update({
                        data: {
                           nom: article_data.nom,
                           stockable: article_data.stockable,
                           prix_unitaire_vente_TTC: article_data.prix_vente,
                           tva: article_data.taux_tva,
                           categorieId: article_data.categorie_id,
                           uniteId: article_data.unite_mesure_id,
                           societe_id: societe_id,
                           activer: true,
                        },
                        where: { id: id_article },
                     })
                     return {
                        sucess: 'Le service a été creer avec success',
                        is_service: true,
                     }
                  }
               } else {
                  await db.produit.update({
                     data: {
                        nom: article_data.nom,
                        stockable: article_data.stockable,
                        tva: article_data.taux_tva,
                        prix_unitaire_vente_TTC: article_data.prix_vente,
                        categorieId: article_data.categorie_id,
                        uniteId: article_data.unite_mesure_id,
                        societe_id: societe_id,
                     },
                     where: { id: id_article },
                  })
                  return {
                     sucess: 'Le service a été creer avec success',
                     is_service: true,
                  }
               }
            } catch (e) {
               return {
                  error: 'Veuillez verifiez si tout les informations sont bien remplit puis réessayez!',
               }
            }
         } else {
            return {
               error: "un problème s'est produit lors de la recuperation de la société. Veuillez vous déconnectez puis vous reconnectez à nouveau",
            }
         }
      }
   }
}

export const get_article_action = async (searchWord?: string) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.produit.findMany({
         where: { societe_id: societe_id, nom: { contains: searchWord } },
         include: { unite_mesure: true, categorie: true },
         orderBy: { nom: 'asc' },
      })
   } else {
      return []
   }
}
export const delete_article_action = async (id: number) => {
   try {
      const societe_id = await getSocieteId()
      if (societe_id) {
         await db.produit.update({
            data: { activer: false },
            where: { id },
         })
         return { success: 'supprimer avec succès!' }
      }
      return {
         error: "Une erreur s'est produit. Veuillez vous déconnecter puis vous reconnecter",
      }
   } catch (e) {
      return {
         error: "une erreur s'est produit lors de la suppression. Réessayez!",
      }
   }
}
export const get_service_produit = async () => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.produit.findMany({
         include: { categorie: true },
         where: { societe_id },
      })
   } else {
      return []
   }
}
