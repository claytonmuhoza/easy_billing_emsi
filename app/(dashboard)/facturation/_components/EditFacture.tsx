'use client'

import { Client } from '@prisma/client'
import { useState } from 'react'
import ClientsList from '../../clients/_components/ClientList'
import EditFactureForm from './EditFactureForm'

import { Facture } from '@prisma/client'
export default function EditFacture({
   facture,
   client_actif,
}: {
   facture: Facture
   client_actif: Client
}) {
   const [client, setClient] = useState<Client | undefined>(client_actif)
   const getCLient = (cl: Client) => {
      cl && setClient(cl)
   }

   return (
      <div className="flex w-full flex-col items-center justify-center">
         {!client && <ClientsList minimal={true} getClient={getCLient} />}
         {client && (
            <EditFactureForm
               client={client}
               setClient={setClient}
               facture={facture}
            />
         )}
      </div>
   )
}
