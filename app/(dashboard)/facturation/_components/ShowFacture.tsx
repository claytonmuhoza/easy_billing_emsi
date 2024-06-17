'use client'

import { useFacturationContext } from '@/context/FacturationContext'

import {
   get_detail_facture_action,
   submit_validate_facture,
   supprimer_details_facture,
} from '@/actions/facture_action'
import { afficherFloat } from '@/app/util'
import { Prisma } from '@prisma/client'
import { Button, Spinner, Table } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useReactToPrint } from 'react-to-print'
import {
   arrondir_fbu,
   tout_taxe_comprise_prix,
} from '../../_components/util_javascript'
import AddDetailFactureNormale from './FN/AddProduct'
import EditDetailFacture from './FN/EditDetailCommande'
import NormalPrint from './NormalPrint'
import EnregistrerDocx from './PrintDocx'
export default function ShowFacture() {
   const returnZeroWhereLessThanTen = (number: number) => {
      if (number < 10) {
         return '0'
      } else {
         return ''
      }
   }
   const { facture, openModal } = useFacturationContext()
   const [isDeleting, setIsDeleting] = useState(false)
   const componentRef = useRef<HTMLDivElement | null>(null)
   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: facture
         ? facture.numero_facture
            ? 'facture numero ' + facture.numero_facture
            : 'facture normale'
         : 'facture normale',
   })
   const [addProduct, setAddProduct] = useState(false)
   const [loading_detail, setLoadingDetail] = useState(true)
   const thousandSeparator = (n: number, sep?: string | undefined) => {
      const sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})')
      let sValue = n + ''

      if (sep === undefined) {
         sep = ' '
      }
      while (sRegExp.test(sValue)) {
         sValue = sValue.replace(sRegExp, '$1' + sep + '$2')
      }
      return sValue
   }
   const detailsIncludes = Prisma.validator<Prisma.DetailFactureDefaultArgs>()({
      include: {
         facture: true,
         produit: true,
      },
   })
   type DetailsFacture = Prisma.DetailFactureGetPayload<typeof detailsIncludes>
   const totalFacture = (details: DetailsFacture[]) => {
      let somme = 0
      if (details.length > 0) {
         for (const detail of details) {
            somme += arrondir_fbu(
               (detail.prix_unitaire_tva +
                  detail.prix_unitaire_vente_hors_tva) *
                  detail.quantite,
            )
         }
      }
      return somme
   }
   const totalTVAFacture = (details: DetailsFacture[]) => {
      let somme = 0
      if (details.length > 0) {
         for (const detail of details) {
            somme += arrondir_fbu(detail.prix_unitaire_tva * detail.quantite)
         }
      }
      return somme
   }
   const [showEditForm, setShowEditForm] = useState<DetailsFacture | undefined>(
      undefined,
   )
   const [detailsFacture, setDetailsFacture] = useState<DetailsFacture[]>([])
   // const societe = await getSociete()
   useEffect(() => {
      if (facture) {
         get_detail_facture_action(facture.id)
            .then((data) => {
               setDetailsFacture(data)
               setLoadingDetail(false)
            })
            .catch(() => {
               setLoadingDetail(false)
            })
      }
   }, [facture, addProduct, showEditForm, isDeleting])
   if (facture) {
      if (facture.etat_facture === 'non_validee') {
         if (showEditForm) {
            return (
               <EditDetailFacture
                  detailFacture={showEditForm}
                  setDetailFacture={setShowEditForm}
               />
            )
         } else {
            return (
               <div>
                  <div className=" flex justify-between border-b border-gray-700">
                     <div className="p-2">
                        <div className="max-w-90">
                           <div>
                              Nom du client :{' '}
                              <span className="font-bold">
                                 {facture.client.nom}
                              </span>
                           </div>
                           <div>NIF du client : {facture.client.NIF}</div>
                        </div>
                        <div>
                           <Button
                              onClick={() => {
                                 openModal('edit')
                              }}
                           >
                              Modifier la facture
                           </Button>
                        </div>
                     </div>
                     <div>
                        <Button
                           className="mt-2"
                           onClick={() => {
                              submit_validate_facture(facture.id)
                                 .then((data) => {
                                    if (data?.result) {
                                       openModal('details', data.result)
                                    }
                                 })
                                 .catch(() => {
                                    alert("une erreur s'est produit")
                                 })
                           }}
                        >
                           Valider la facture
                        </Button>
                     </div>
                     <div>
                        <div>
                           TVA :{' '}
                           <span className="font-bold">
                              {loading_detail
                                 ? 'calcul en cours...'
                                 : thousandSeparator(
                                      Number(
                                         afficherFloat(
                                            totalTVAFacture(detailsFacture),
                                         ),
                                      ),
                                      '.',
                                   ) +
                                   ' ' +
                                   facture.devise}
                           </span>
                        </div>
                        <div>
                           Montant total :{' '}
                           <span className="font-bold">
                              {loading_detail
                                 ? 'calcul en cours...'
                                 : thousandSeparator(
                                      totalFacture(detailsFacture),
                                      undefined,
                                   ) +
                                   ' ' +
                                   facture.devise}
                           </span>
                        </div>
                     </div>
                  </div>
                  {!addProduct ? (
                     <>
                        <div className="m-3 flex justify-center">
                           <Button onClick={() => setAddProduct(true)}>
                              Ajouter un produit ou un service
                           </Button>
                        </div>
                        <div>
                           <Table>
                              <Table.Head>
                                 <Table.HeadCell>Article</Table.HeadCell>
                                 <Table.HeadCell>
                                    {tout_taxe_comprise_prix
                                       ? 'PU'
                                       : 'P.U HTVA'}
                                 </Table.HeadCell>
                                 <Table.HeadCell>Quantité</Table.HeadCell>
                                 <Table.HeadCell>total hors TVA</Table.HeadCell>
                                 <Table.HeadCell>TVA Total</Table.HeadCell>

                                 <Table.HeadCell>Total</Table.HeadCell>
                                 <Table.HeadCell>Action</Table.HeadCell>
                              </Table.Head>
                              <Table.Body className="divide-y">
                                 {loading_detail ? (
                                    <Table.Row
                                       className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                       // key={facture.id + 'factures'}
                                    >
                                       <Table.Cell
                                          colSpan={6}
                                          // onClick={() => changefacture(facture)}
                                          className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                                       >
                                          <Spinner />
                                       </Table.Cell>
                                    </Table.Row>
                                 ) : detailsFacture.length > 0 ? (
                                    detailsFacture.map((element) => (
                                       <Table.Row
                                          className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                          key={element.id}
                                       >
                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                          >
                                             {element.produit.nom}
                                          </Table.Cell>
                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                          >
                                             {tout_taxe_comprise_prix
                                                ? thousandSeparator(
                                                     element.prix_vente_unitaire,
                                                  )
                                                : thousandSeparator(
                                                     element.prix_unitaire_vente_hors_tva,
                                                  )}
                                          </Table.Cell>
                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                          >
                                             {element.quantite}
                                          </Table.Cell>

                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer break-words font-medium text-gray-900 dark:text-white"
                                          >
                                             {thousandSeparator(
                                                arrondir_fbu(
                                                   Number(
                                                      afficherFloat(
                                                         element.prix_unitaire_vente_hors_tva *
                                                            element.quantite,
                                                      ),
                                                   ),
                                                ),
                                             )}
                                          </Table.Cell>
                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer break-words  font-medium text-gray-900 dark:text-white"
                                          >
                                             {thousandSeparator(
                                                arrondir_fbu(
                                                   Number(
                                                      afficherFloat(
                                                         element.prix_unitaire_tva *
                                                            element.quantite,
                                                      ),
                                                   ),
                                                ),
                                             )}
                                          </Table.Cell>
                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer break-words  font-medium text-gray-900 dark:text-white"
                                          >
                                             {thousandSeparator(
                                                arrondir_fbu(
                                                   (element.prix_unitaire_vente_hors_tva +
                                                      element.prix_unitaire_tva) *
                                                      element.quantite,
                                                ),
                                                '.',
                                             ) +
                                                ' ' +
                                                facture.devise}
                                          </Table.Cell>

                                          <Table.Cell
                                             aria-controls="facture"
                                             aria-expanded
                                             className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                          >
                                             {isDeleting ? (
                                                'suppression en cours'
                                             ) : (
                                                <>
                                                   {' '}
                                                   <button
                                                      onClick={() => {
                                                         setShowEditForm(
                                                            element,
                                                         )
                                                      }}
                                                   >
                                                      <HiPencil className="cursor-pointer text-6 text-blue-700" />
                                                   </button>
                                                   <button
                                                      onClick={() => {
                                                         setIsDeleting(true)
                                                         supprimer_details_facture(
                                                            element.id,
                                                         )
                                                            .then(() => {
                                                               setIsDeleting(
                                                                  false,
                                                               )
                                                            })
                                                            .catch(() => {
                                                               setIsDeleting(
                                                                  false,
                                                               )
                                                            })
                                                      }}
                                                      className="bg-transparent dark:bg-transparent"
                                                   >
                                                      <HiTrash className="cursor-pointer text-6 text-red-700" />
                                                   </button>
                                                </>
                                             )}
                                          </Table.Cell>
                                       </Table.Row>
                                    ))
                                 ) : (
                                    <Table.Row
                                       className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                       // key={facture.id + 'factures'}
                                    >
                                       <Table.Cell
                                          colSpan={6}
                                          // onClick={() => changefacture(facture)}
                                          className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                                       >
                                          Aucun article
                                       </Table.Cell>
                                    </Table.Row>
                                 )}
                              </Table.Body>
                           </Table>
                        </div>
                     </>
                  ) : (
                     <AddDetailFactureNormale
                        setShowSelectProduit={setAddProduct}
                     />
                  )}
               </div>
            )
         }
      } else {
         return (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3">
               {facture.etat_facture === 'validee' ? (
                  <div>
                     <Button onClick={handlePrint}>imprimer la facture</Button>
                     <EnregistrerDocx detailsFacture={detailsFacture} />
                  </div>
               ) : (
                  <div>
                     <div>
                        <Button onClick={handlePrint}>
                           imprimer la facture
                        </Button>
                        <EnregistrerDocx detailsFacture={detailsFacture} />
                     </div>
                     <div className="text-red-500">
                        La facture a été annulée.
                     </div>
                     <div>Motif d'annulation : {facture.facture_motif}</div>
                  </div>
               )}
               <div ref={componentRef}>
                  <NormalPrint
                     facture={facture}
                     detailsFacture={detailsFacture}
                     arrondir_fbu={arrondir_fbu}
                     afficherFloat={afficherFloat}
                     thousandSeparator={thousandSeparator}
                     returnZeroWhereLessThanTen={returnZeroWhereLessThanTen}
                     loading_detail={loading_detail}
                     totalFacture={totalFacture}
                     totalTVAFacture={totalTVAFacture}
                  />
               </div>
            </div>
         )
      }
   } else {
      return <div>La facture n'existe pas</div>
   }
}
