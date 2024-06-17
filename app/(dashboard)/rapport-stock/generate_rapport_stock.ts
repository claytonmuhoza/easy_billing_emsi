import { Prisma } from '@prisma/client'
import { sumTotalEntree, sumTotalSortie } from './function_calcule'
const mIncludes = Prisma.validator<Prisma.ProduitFindManyArgs>()({
   include: { mouvements_stock: true },
})
type ProduitStockType = Prisma.ProduitGetPayload<typeof mIncludes>
export const transformRapport = (produits: ProduitStockType[]) => {
   const products = produits.map((produit) => {
      return {
         nom: produit.nom,
         prix_de_revient: produit.prix_unitaire_revien,
         devise: 'BIF',
         stock_actuel: produit.stock_actuel,
         sortie: sumTotalSortie(produit.mouvements_stock),
         entree: sumTotalEntree(produit.mouvements_stock),
      }
   })
   return products
}
