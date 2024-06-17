'use facture?.client'
import { Prisma } from '@prisma/client'
import { useState } from 'react'
import CreateEntreeForm from './_create_form_component/createEntreeForm'
import SelectProduct from './_create_form_component/select_product'
const pIncludes = Prisma.validator<Prisma.ProduitDefaultArgs>()({
   include: { unite_mesure: true, categorie: true },
})
type ProduitUniteMesure = Prisma.ProduitGetPayload<typeof pIncludes>
export default function CreateEntree({
   closeModal,
}: {
   closeModal: () => void
}) {
   const [selectedProduit, setSelectedProduit] = useState<
      ProduitUniteMesure | undefined
   >(undefined)
   if (selectedProduit) {
      return (
         <CreateEntreeForm produit={selectedProduit} closeModal={closeModal} />
      )
   } else {
      return <SelectProduct setSelectProduit={setSelectedProduit} />
   }
}
