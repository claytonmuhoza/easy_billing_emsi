'use client'
import { useBanqueContext } from '@/context/BanqueContext'
import { Modal, ModalBody } from 'flowbite-react'
import CreateBanque from './CreateBanque'
import EditBanque from './EditBanque'

export default function BanqueModal() {
   const { banqueModalState, closeModal, view, banque } = useBanqueContext()

   return (
      <Modal
         size={'3xl'}
         onClose={closeModal}
         show={banqueModalState}
         popup
         className="max-h-screen bg-dark"
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {view === 'create'
                  ? 'Nouvelle banque'
                  : view === 'details'
                    ? 'Details'
                    : view === 'edit'
                      ? 'Modifier Banque'
                      : view + ' banque'}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h- overflow-y-auto rounded-b-md dark:bg-gray-800">
            {view === 'create' && <CreateBanque />}

            {view === 'edit' && banque ? <EditBanque banque={banque} /> : <></>}
            {/* {view === 'details' && <ShowClient />} */}
         </ModalBody>
         {/* <Modal.Footer>oklm</Modal.Footer> */}
      </Modal>
   )
}
