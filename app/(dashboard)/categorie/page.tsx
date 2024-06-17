'use client'
import { useCategorieContext } from '@/context/CategorieContext'
import CategorieList from './_components/CategorieList'
import CategorieModal from './_components/CategorieModal'

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
