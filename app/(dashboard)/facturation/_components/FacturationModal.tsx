'use facture?.client'

import { useFacturationContext } from '@/context/FacturationContext'
import { Modal, ModalBody } from 'flowbite-react'
import AnnulationForm from './AnnulationForm'
import CreateFacture from './CreateFacture'
import EditFacture from './EditFacture'
import ViewFacture from './ShowFacture'
import SupprimerForm from './SupprimerForm'

export default function FacturationModal() {
   const { facturationModalState, closeModal, view, facture } =
      useFacturationContext()
   // console.log(view)
   return (
      <Modal
         size={view === 'annuler' ? undefined : '6xl'}
         onClose={closeModal}
         show={facturationModalState}
         popup
         className={`${view === 'annuler' ? '' : 'h-full'} ${
            view === 'annuler' ? '' : 'max-h-screen'
         } bg-dark`}
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {'Facture ' + view}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h-[80vh] overflow-y-auto rounded-b-md dark:bg-gray-900">
            {view === 'create' && <CreateFacture />}

            {view === 'details' && <ViewFacture />}
            {view === 'annuler' && <AnnulationForm />}
            {view === 'supprimer' && <SupprimerForm />}
            {view === 'edit' && facture ? (
               <EditFacture facture={facture} client_actif={facture.client} />
            ) : (
               <></>
            )}
         </ModalBody>
         {/* <Modal.Footer>oklm</Modal.Footer> */}
      </Modal>
   )
}
