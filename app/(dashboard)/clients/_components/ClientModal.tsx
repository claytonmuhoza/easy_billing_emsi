'use client'
import { useClientContext } from '@/context/ClientContext'
import { Modal, ModalBody } from 'flowbite-react'
import CreateClient from './CreateClient'
import EditClient from './EditClient'
import ShowClient from './ShowClient'

export default function ClientModal() {
   const { clientModalState, closeModal, view, client } = useClientContext()
   return (
      <Modal
         size={'6xl'}
         onClose={closeModal}
         show={clientModalState}
         popup
         className="max-h-screen bg-dark"
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {view === 'create'
                  ? 'Nouveau client'
                  : view === 'edit'
                    ? 'Modifier le client'
                    : view === 'details'
                      ? ' Detail Client'
                      : view + ' ' + 'client'}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h-[80vh] overflow-y-auto rounded-b-md dark:bg-gray-800">
            {view === 'create' && <CreateClient />}

            {view === 'edit' && client ? <EditClient client={client} /> : <></>}
            {view === 'details' && <ShowClient />}
         </ModalBody>
         {/* <Modal.Footer>oklm</Modal.Footer> */}
      </Modal>
   )
}
