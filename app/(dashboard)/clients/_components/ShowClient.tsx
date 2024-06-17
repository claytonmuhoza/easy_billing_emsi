'use client'
import { useClientContext } from '@/context/ClientContext'
import RapportVente from '../../rapport-vente/page'

export default function ShowClient() {
   const { client } = useClientContext()
   return (
      <div>
         <RapportVente client={client} />
      </div>
   )
}
