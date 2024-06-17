'use client'

import { Banque } from '@prisma/client'
import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'

interface BanqueContextProps {
   banqueModalState: boolean
   banque: Banque | undefined
   view: string
   //    setFacturationModalState: (state: boolean) => void
   //    setFacture: (act?: object) => void
   openModal: (view: string, banque?: Banque) => void
   closeModal: () => void
}

export const BanqueContext = createContext<BanqueContextProps>(
   {} as BanqueContextProps,
)

export const BanqueProvider: FC<PropsWithChildren> = ({ children }) => {
   const [banqueModalState, setBanqueModalState] = useState(false)
   const [banque, setBanque] = useState<Banque>() //explain this line ?
   const [view, setView] = useState<string>('')

   const closeModal = () => {
      setBanqueModalState(false)
   }
   const openModal = (view: string = 'details', banque?: Banque) => {
      banque && setBanque(banque)
      setView(view)
      setBanqueModalState(true)
   }

   return (
      <BanqueContext.Provider
         value={{
            banque,
            banqueModalState,
            openModal,
            closeModal,
            view,
         }}
      >
         {children}
      </BanqueContext.Provider>
   )
}

export function useBanqueContext(): BanqueContextProps {
   const context = useContext(BanqueContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useBanqueContext should be used within the BanqueContext provider!',
      )
   }
   return context
}
