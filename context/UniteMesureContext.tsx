'use client'
import { UniteMesure } from '@prisma/client'
import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'

interface UniteMesureContextProps {
   uniteMesureModalState: boolean
   uniteMesure: UniteMesure | undefined
   view: string
   //    setFacturationModalState: (state: boolean) => void
   //    setFacture: (act?: object) => void
   openModal: (view: string, uniteMesure?: UniteMesure) => void
   closeModal: () => void
}

export const UniteMesureContext = createContext<UniteMesureContextProps>(
   {} as UniteMesureContextProps,
)

export const UniteMesureProvider: FC<PropsWithChildren> = ({ children }) => {
   const [uniteMesureModalState, setUniteMesureModalState] = useState(false)
   const [uniteMesure, setClient] = useState<UniteMesure>() //explain this line ?
   const [view, setView] = useState<string>('')

   const closeModal = () => {
      setUniteMesureModalState(false)
   }
   const openModal = (view: string = 'details', uniteMesure?: UniteMesure) => {
      uniteMesure && setClient(uniteMesure)
      setView(view)
      setUniteMesureModalState(true)
   }

   return (
      <UniteMesureContext.Provider
         value={{
            uniteMesure,
            uniteMesureModalState,
            openModal,
            closeModal,
            view,
         }}
      >
         {children}
      </UniteMesureContext.Provider>
   )
}

export function useUniteMesureContext(): UniteMesureContextProps {
   const context = useContext(UniteMesureContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useSidebarContext should be used within the UniteMesureContext provider!',
      )
   }
   return context
}
