'use client'

import { Client } from '@prisma/client'
import { useState } from 'react'
import ClientsList from '../../clients/_components/ClientList'
import NewFacture from './NewFacture'

export default function CreateFacture() {
   const [client, setClient] = useState<Client | undefined>()

   const getCLient = (cl: Client) => {
      cl && setClient(cl)
   }

   return (
      <div className="flex w-full flex-col items-center justify-center">
         {!client && <ClientsList minimal={true} getClient={getCLient} />}
         {client && <NewFacture client={client} setClient={setClient} />}
      </div>
   )
}
