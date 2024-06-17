'use client'
import { useUniteMesureContext } from '@/context/UniteMesureContext'
import UniteMesureList from './_component/UniteMesureList'
import UniteMesureModal from './_component/UniteMesureModal'

const UniteMesurePage = () => {
   const { uniteMesureModalState } = useUniteMesureContext()

   return (
      <>
         <UniteMesureList />
         {uniteMesureModalState && <UniteMesureModal />}
      </>
   )
}

export default UniteMesurePage
