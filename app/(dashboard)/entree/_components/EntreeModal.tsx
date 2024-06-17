'use client'
import { Modal, ModalBody } from 'flowbite-react'
import CreateEntree from './CreateEntree'

export default function EntreeModal({
   title,
   closeModal,
}: {
   title: string
   closeModal: () => void
}) {
   return (
      <Modal
         size={'3xl'}
         onClose={closeModal}
         show
         popup
         className="max-h-screen bg-dark"
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {title}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h- overflow-y-auto rounded-b-md dark:bg-gray-800">
            <CreateEntree closeModal={closeModal} />
         </ModalBody>
      </Modal>
   )
}
