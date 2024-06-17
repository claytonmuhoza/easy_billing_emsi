'use client'

import { Client } from '@prisma/client'
import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'

interface ClientContextProps {
   clientModalState: boolean
   client: Client | undefined
   view: string
   //    setFacturationModalState: (state: boolean) => void
   //    setFacture: (act?: object) => void
   openModal: (view: string, client?: Client) => void
   closeModal: () => void
   alphabetic: boolean
   setAlphabetic: (arg0: boolean) => void
}

export const ClientContext = createContext<ClientContextProps>(
   {} as ClientContextProps,
)

export const ClientProvider: FC<PropsWithChildren> = ({ children }) => {
   const [clientModalState, setClientModalState] = useState(false)
   const [client, setClient] = useState<Client>() //explain this line ?
   const [alphabetic, setAlphabetic] = useState(true)
   const [view, setView] = useState<string>('')
   const closeModal = () => {
      setClientModalState(false)
   }
   const openModal = (view: string = 'details', client?: Client) => {
      client && setClient(client)
      setView(view)
      setClientModalState(true)
   }

   return (
      <ClientContext.Provider
         value={{
            alphabetic,
            setAlphabetic,
            client,
            clientModalState,
            openModal,
            closeModal,
            view,
         }}
      >
         {children}
      </ClientContext.Provider>
   )
}

export function useClientContext(): ClientContextProps {
   const context = useContext(ClientContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useSidebarContext should be used within the ClientContext provider!',
      )
   }
   return context
}
