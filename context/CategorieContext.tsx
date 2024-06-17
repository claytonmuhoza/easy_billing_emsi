'use client'

import { Categorie } from '@prisma/client'
import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'

interface CategorieContextProps {
   categorieModalState: boolean
   categorie: Categorie | undefined
   view: string
   //    setFacturationModalState: (state: boolean) => void
   //    setFacture: (act?: object) => void
   openModal: (view: string, categorie?: Categorie) => void
   closeModal: () => void
}

export const CategorieContext = createContext<CategorieContextProps>(
   {} as CategorieContextProps,
)

export const CategorieProvider: FC<PropsWithChildren> = ({ children }) => {
   const [categorieModalState, setCategorieModalState] = useState(false)
   const [categorie, setCategorie] = useState<Categorie>() //explain this line ?
   const [view, setView] = useState<string>('')

   const closeModal = () => {
      setCategorieModalState(false)
   }
   const openModal = (view: string = 'details', categorie?: Categorie) => {
      categorie && setCategorie(categorie)
      setView(view)
      setCategorieModalState(true)
   }

   return (
      <CategorieContext.Provider
         value={{
            categorie,
            categorieModalState,
            openModal,
            closeModal,
            view,
         }}
      >
         {children}
      </CategorieContext.Provider>
   )
}

export function useCategorieContext(): CategorieContextProps {
   const context = useContext(CategorieContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useCategorieContext should be used within the CategorieContext provider!',
      )
   }
   return context
}
