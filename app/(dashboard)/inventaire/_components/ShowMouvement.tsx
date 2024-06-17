'use client'
import { Prisma } from '@prisma/client'
const mIncludes = Prisma.validator<Prisma.MouvementStockDefaultArgs>()({
   include: { produit: true, unite_mesure: true, facture: true },
})
type MouvementStockType = Prisma.ProduitGetPayload<typeof mIncludes>
const ShowMouvementPage = (mouvement: MouvementStockType) => {
   return (
      <div>
         <h2>{JSON.stringify(mouvement)}</h2>
      </div>
   )
}
export default ShowMouvementPage
