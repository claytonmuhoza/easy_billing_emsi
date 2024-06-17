'use client'
import { useBanqueContext } from '@/context/BanqueContext'
import BanqueList from './_components/BanqueList'
import BanqueModal from './_components/BanqueModal'

const PageNouveauCategorie = () => {
   const { banqueModalState } = useBanqueContext()
   console.log(banqueModalState)
   return (
      <>
         <BanqueList />
         {banqueModalState ? <BanqueModal /> : <></>}
      </>
   )
}
export default PageNouveauCategorie
