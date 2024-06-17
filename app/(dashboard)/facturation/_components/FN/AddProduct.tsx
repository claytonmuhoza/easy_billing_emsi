'use client'
import { Produit } from '@prisma/client'
import { useState } from 'react'
import SelectProduct from './SelectProduct'
import AddDetailProduitForm from './addDetailProduitForm'
export default function AddDetailFactureNormale({
   setShowSelectProduit,
}: {
   setShowSelectProduit: (show: boolean) => void
}) {
   const [product, setSelectedProduct] = useState<Produit | undefined>(
      undefined,
   )
   if (product) {
      return (
         <AddDetailProduitForm
            product={product}
            setSelectProduit={setSelectedProduct}
            setShowDetailFacture={setShowSelectProduit}
         />
      )
   } else {
      return (
         <SelectProduct
            setSelectProduit={setSelectedProduct}
            setShowSelectProduct={setShowSelectProduit}
         />
      )
   }
}
