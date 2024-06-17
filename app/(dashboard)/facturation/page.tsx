'use client'

import { useFacturationContext } from '@/context/FacturationContext'
import FacturationModal from './_components/FacturationModal'
import FacturesList from './_components/FactureList'

export default function Factures() {
   const { facturationModalState } = useFacturationContext()
   return (
      <>
         <FacturesList />
         {facturationModalState && <FacturationModal />}
      </>
   )
}
