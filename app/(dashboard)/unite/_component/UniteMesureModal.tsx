'use client'
import { useUniteMesureContext } from '@/context/UniteMesureContext'
import { Modal, ModalBody } from 'flowbite-react'
import CreateUniteMesure from './CreateUniteMesure'
import EditUniteMesure from './EditUniteMesure'

export default function UniteMesureModal() {
   const { uniteMesureModalState, closeModal, view, uniteMesure } =
      useUniteMesureContext()

   return (
      <Modal
         size={'3xl'}
         onClose={closeModal}
         show={uniteMesureModalState}
         popup
         className="max-h-screen bg-dark"
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {view + ' Unité de Mesure'}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h- overflow-y-auto rounded-b-md dark:bg-gray-800">
            {view === 'create' && <CreateUniteMesure />}
            {/* {view === 'details' && <ShowClient />} */}
            {view === 'edit' && uniteMesure ? (
               <EditUniteMesure uniteMesure={uniteMesure} />
            ) : (
               <></>
            )}
         </ModalBody>
         {/* <Modal.Footer>oklm</Modal.Footer> */}
      </Modal>
   )
}
