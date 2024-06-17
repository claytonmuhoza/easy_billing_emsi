'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { rapport_vente_filter_schema } from '@/schemas'
import z from 'zod'
export const rapport_vente_action = async (
   values: z.infer<typeof rapport_vente_filter_schema>,
   client_id?: number,
) => {
   const societe_id = await getSocieteId()

   if (societe_id) {
      const valide = rapport_vente_filter_schema.safeParse(values)

      if (valide.success) {
         const { date_debut, date_fin, type_facture } = valide.data
         if (date_debut && date_fin) {
            if (type_facture === 'tous') {
               return await db.facture.findMany({
                  where: {
                     client: { id: client_id },
                     OR: [
                        { type_facture: 'FN', etat_facture: 'validee' },
                        {
                           type_facture: 'FN',
                           etat_facture: 'annuler',
                        },
                     ],
                     date_paiement: {
                        gte: new Date(date_debut),
                        lte: new Date(date_fin),
                     },
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
               if (type_facture === 'annuler') {
                  return await db.facture.findMany({
                     where: {
                        client: { id: client_id },
                        type_facture: 'FN',
                        etat_facture: 'annuler',

                        date_paiement: {
                           gte: new Date(date_debut),
                           lte: new Date(date_fin),
                        },
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
                        client: { id: client_id },
                        type_facture: 'FN',
                        etat_facture: 'validee',

                        date_paiement: {
                           gte: new Date(date_debut),
                           lte: new Date(date_fin),
                        },
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
            }
         } else {
            if (date_debut) {
               if (type_facture === 'tous') {
                  return await db.facture.findMany({
                     where: {
                        client: { id: client_id },
                        OR: [
                           { type_facture: 'FN', etat_facture: 'validee' },
                           {
                              type_facture: 'FN',
                              etat_facture: 'annuler',
                           },
                        ],
                        date_paiement: {
                           gte: new Date(date_debut),
                        },
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
                  if (type_facture === 'annuler') {
                     return await db.facture.findMany({
                        where: {
                           client: { id: client_id },
                           type_facture: 'FN',
                           etat_facture: 'annuler',

                           date_paiement: {
                              gte: new Date(date_debut),
                           },
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
                           client: { id: client_id },
                           type_facture: 'FN',
                           etat_facture: 'validee',

                           date_paiement: {
                              gte: new Date(date_debut),
                           },
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
               }
            } else {
               if (date_fin) {
                  if (type_facture === 'tous') {
                     return await db.facture.findMany({
                        where: {
                           client: { id: client_id },
                           OR: [
                              { type_facture: 'FN', etat_facture: 'validee' },
                              {
                                 type_facture: 'FN',
                                 etat_facture: 'annuler',
                              },
                           ],
                           date_paiement: {
                              lte: new Date(date_fin),
                           },
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
                     if (type_facture === 'annuler') {
                        return await db.facture.findMany({
                           where: {
                              client: { id: client_id },
                              type_facture: 'FN',
                              etat_facture: 'annuler',

                              date_paiement: {
                                 lte: new Date(date_fin),
                              },
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
                              client: { id: client_id },
                              type_facture: 'FN',
                              etat_facture: 'validee',

                              date_paiement: {
                                 lte: new Date(date_fin),
                              },
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
                  }
               } else {
                  if (type_facture === 'tous') {
                     return await db.facture.findMany({
                        where: {
                           client: { id: client_id },
                           OR: [
                              { type_facture: 'FN', etat_facture: 'validee' },
                              {
                                 type_facture: 'FN',
                                 etat_facture: 'annuler',
                              },
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
                     if (type_facture === 'annuler') {
                        return await db.facture.findMany({
                           where: {
                              client: { id: client_id },
                              type_facture: 'FN',
                              etat_facture: 'annuler',
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
                              client: { id: client_id },
                              type_facture: 'FN',
                              etat_facture: 'validee',
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
                  }
               }
            }
         }
      } else {
         return []
      }
   } else {
      return []
   }
}
