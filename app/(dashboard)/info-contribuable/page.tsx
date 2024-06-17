'use client'
import { get_contribuable_action } from '@/actions/contribuable/update-contribuable_action'
import { Societe } from '@prisma/client'
import { useEffect, useState } from 'react'
import NewSocietePage from './_components/newSociete'
const PageNouveauCategorie = () => {
   const [societe, setSociete] = useState<Societe | null>(null)
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      get_contribuable_action().then((data) => {
         setSociete(data), setLoading(false)
      })
   }, [])
   if (loading) {
      return <div>Chargement des Informations de la société...</div>
   }
   if (societe) {
      return <NewSocietePage contribuable={societe} />
   } else {
      return <div>Pas de société trouvé</div>
   }
}
export default PageNouveauCategorie
