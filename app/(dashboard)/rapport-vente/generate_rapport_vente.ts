import { DetailFacture, Prisma } from '@prisma/client'
import { arrondir_fbu } from '../_components/util_javascript'
type FactureType = Prisma.FactureGetPayload<typeof fIncludes>
export const totalChiffreAffaire = (factures: FactureType[]) => {
   let somme_total_factures = 0
   for (const facture of factures) {
      somme_total_factures =
         somme_total_factures + totalFacture(facture.details_facture)
   }
   return somme_total_factures
}
export const total_tva_chiffre_affaire = (factures: FactureType[]) => {
   let somme_total_factures = 0
   for (const facture of factures) {
      somme_total_factures =
         somme_total_factures +
         calcul_tva_detail_facture(facture.details_facture)
   }
   return somme_total_factures
}
const calcul_tva_detail_facture = (details: DetailFacture[]) => {
   let somme = 0
   if (details.length > 0) {
      for (const detail of details) {
         somme += arrondir_fbu(detail.prix_unitaire_tva * detail.quantite)
      }
   }
   return arrondir_fbu(somme)
}
const totalFacture = (details: DetailFacture[]) => {
   let somme = 0
   if (details.length > 0) {
      for (const detail of details) {
         somme += arrondir_fbu(
            (detail.prix_unitaire_vente_hors_tva + detail.prix_unitaire_tva) *
               detail.quantite,
         )
      }
   }
   return arrondir_fbu(somme)
}
const fIncludes = Prisma.validator<Prisma.FactureDefaultArgs>()({
   include: {
      details_facture: true,
      client: true,
      societe: true,
      banque: true,
   },
})
type Facture = Prisma.FactureGetPayload<typeof fIncludes>
export function transform_rapport_vente(factures: Facture[]) {
   const factureTransform = factures.map((facture, index) => {
      return {
         N: index + 1,
         numero_facture: facture.numero_facture,

         nom_du_cleint: facture.client.nom,
         nif_client: facture.client.NIF,
         montant: totalFacture(facture.details_facture),
         devise: facture.devise,
         date_facturation: facture.date_paiement
            ? facture.date_paiement.toISOString().split('T')[0]
            : '',
         heure: facture.date_paiement
            ? facture.date_paiement.toISOString().split('T')[1].split('.')[0]
            : '',
      }
   })
   return factureTransform
}
