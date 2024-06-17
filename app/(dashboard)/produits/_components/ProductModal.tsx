'use client'
import { useProductContext } from '@/context/ProductContext'
import { Modal, ModalBody } from 'flowbite-react'
import { useState } from 'react'
import CreateEntreeForm from '../../entree/_components/_create_form_component/createEntreeForm'
import CreateInventaireForm from '../../inventaire/_components/_create_form_component/createEntreeForm'
import CreateSortieForm from '../../sortie/_components/_create_form_component/createEntreeForm'
import CreateProduct from './CreateProduct'
import EditArticle from './EditProduct'
import ShowProduct from './ShowProduct'

export default function ProductModal() {
   const { productModalState, closeModal, view, produit } = useProductContext()
   const [action, setAction] = useState('')
   return (
      <Modal
         size={'6xl'}
         onClose={closeModal}
         show={productModalState}
         popup
         className="max-h-screen bg-dark"
      >
         {/* <ModalHeader> */}
         <Modal.Header className="rounded-t-md border-b p-3 dark:border-gray-800 dark:bg-gray-700 md:p-4">
            <span className="capitalise mt-2 pl-6 text-center font-semibold">
               {view === 'create'
                  ? 'Créer un produit ou service'
                  : view === 'edit'
                    ? 'Modifier produit ou service'
                    : action === 'enter'
                      ? 'Entrer de stock'
                      : action === 'sortie'
                        ? 'Sortie de stock'
                        : action === 'inventaire'
                          ? 'Inventaire de stock'
                          : view}
            </span>
         </Modal.Header>
         {/* </ModalHeader> */}
         <ModalBody className="min-h-[80vh] overflow-y-auto rounded-b-md dark:bg-gray-800">
            {view === 'create' && <CreateProduct />}
            {view === 'details' && produit ? (
               action === 'entrer' ? (
                  <CreateEntreeForm produit={produit} closeModal={closeModal} />
               ) : action === 'sortie' ? (
                  <CreateSortieForm produit={produit} closeModal={closeModal} />
               ) : action === 'inventaire' ? (
                  <CreateInventaireForm
                     produit={produit}
                     closeModal={closeModal}
                  />
               ) : (
                  <ShowProduct setAction={setAction} />
               )
            ) : (
               <></>
            )}
            {view === 'edit' && produit ? (
               <EditArticle produit={produit} />
            ) : (
               <></>
            )}
         </ModalBody>
         {/* <Modal.Footer>oklm</Modal.Footer> */}
      </Modal>
   )
}
