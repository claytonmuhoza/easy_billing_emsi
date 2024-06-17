'use client'

import {
   FC,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from 'react'

interface User {
   email: string
}

interface SessionContextProps {
   user: User | null
   // setUser: Dispatch<SetStateAction<object>>
   // openModal: () => void
   // closeModal: () => void
}

export const SessionContext = createContext<SessionContextProps>(
   {} as SessionContextProps,
)

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
   const [user] = useState<User | null>(null)

   // useEffect(() => {
   //    const fetchUser = async () => {
   //       try {
   //          const response = await fetch('/api/getUser')
   //          if (response.ok) {
   //             const data = await response.json()
   //             setUser(data.user)
   //          } else {
   //             // Handle error
   //          }
   //       } catch (error) {
   //          // Handle error
   //       }
   //    }

   //    fetchUser()
   // }, [])
   return (
      <SessionContext.Provider
         value={{
            user,
            // setUser,
         }}
      >
         {children}
      </SessionContext.Provider>
   )
}

export function useSessionContext(): SessionContextProps {
   const context = useContext(SessionContext)
   if (typeof context === 'undefined') {
      throw new Error(
         'useSessionContext should be used within the SessionContext provider!',
      )
   }
   return context
}
