'use client'

import { Prisma } from '@prisma/client'
import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'
const pIncludes = Prisma.validator<Prisma.ProduitDefaultArgs>()({
   include: { unite_mesure: true, categorie: true },
})
type ProduitUniteMesure = Prisma.ProduitGetPayload<typeof pIncludes>
interface ProductContextProps {
   productModalState: boolean
   produit: ProduitUniteMesure | undefined
   view: string
   //    setFacturationModalState: (state: boolean) => void
   //    setFacture: (act?: object) => void
   openModal: (view: string, prodcuit?: ProduitUniteMesure) => void
   closeModal: () => void
}

export const ProductContext = createContext<ProductContextProps>(
   {} as ProductContextProps,
)

export const ProductProvider: FC<PropsWithChildren> = ({ children }) => {
   const [productModalState, setProductModalState] = useState(false)
   const [produit, setProduit] = useState<ProduitUniteMesure>() //explain this line ?
   const [view, setView] = useState<string>('')

   const closeModal = () => {
      setProductModalState(false)
   }
   const openModal = (
      view: string = 'details',
      produit?: ProduitUniteMesure,
   ) => {
      produit && setProduit(produit)
      setView(view)
      setProductModalState(true)
   }

   return (
      <ProductContext.Provider
         value={{
            produit,
            productModalState,
            openModal,
            closeModal,
            view,
         }}
      >
         {children}
      </ProductContext.Provider>
   )
}

export function useProductContext(): ProductContextProps {
   const context = useContext(ProductContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useProductContext should be used within the ProductContext provider!',
      )
   }
   return context
}
