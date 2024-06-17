'use client'
import { useCategorieContext } from '@/context/CategorieContext'
import CategorieModal from './_components/CategorieModal'
import CategorieList from './_components/SignateurList'

const PageNouveauCategorie = () => {
   const { categorieModalState } = useCategorieContext()
   console.log(categorieModalState)

   return (
      <>
         <CategorieList />
         {categorieModalState && <CategorieModal />}
      </>
   )
}
export default PageNouveauCategorie
