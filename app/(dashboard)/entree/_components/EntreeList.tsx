'use client'

import { get_stock_mouvement_entree } from '@/actions/ebms/stock_mouvement'
import {
   BtnBack,
   BtnCreate,
   BtnRefresh,
} from '@/app/(dashboard)/facturation/_components/content'
import { Prisma } from '@prisma/client'
import { Spinner, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
//'../../facturation/_components/content'
import EntreeModal from './EntreeModal'
export default function EntreeList() {
   const mIncludes = Prisma.validator<Prisma.MouvementStockFindManyArgs>()({
      include: { unite_mesure: true, produit: true, facture: true },
   })
   type MouvementStockType = Prisma.MouvementStockGetPayload<typeof mIncludes>
   const [mouvements, setMouvements] = useState<MouvementStockType[]>([])
   const [loadingProduit, setLoadingProduit] = useState(true)
   const [error, setError] = useState(false)
   const [, setSelectedMouvement] = useState<MouvementStockType | undefined>(
      undefined,
   )
   const [modalState, setOpenModal] = useState(false)
   const [modalTitle, setModalTitle] = useState('')

   const closeModal = () => {
      setOpenModal(false)
      setSelectedMouvement(undefined)
   }
   const [refresh, setRefresh] = useState(false)
   const handleRefresh = () => {
      setRefresh(!refresh)
   }
   const nouveauEntree = () => {
      setModalTitle('Nouvelle Entrée')
      setSelectedMouvement(undefined)
      setOpenModal(true)
   }
   useEffect(() => {
      get_stock_mouvement_entree()
         .then((data): void => {
            setMouvements(data)
            setLoadingProduit(false)
            setError(false)
         })
         .catch((err) => console.log(err))
   }, [modalState, refresh])

   return (
      <div className="flex w-full flex-col gap-4 p-4">
         <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  {<BtnBack />}
                  <BtnRefresh
                     onClick={() => {
                        setLoadingProduit(true)
                        handleRefresh()
                     }}
                  />
                  <BtnCreate
                     name="Nouvelle entrée"
                     onClick={() => nouveauEntree()}
                  />
               </>
            </div>
            {/* <SearchBar handdleSearch={} className="w-full flex-1 " title="une Categorie" /> */}
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </div>
         <div>
            {modalState ? (
               <EntreeModal closeModal={closeModal} title={modalTitle} />
            ) : (
               <></>
            )}
         </div>
         <div className="h-[70vh] overflow-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>Produit</Table.HeadCell>
                  <Table.HeadCell>Prix de revient</Table.HeadCell>
                  <Table.HeadCell>Type mouvement</Table.HeadCell>
                  <Table.HeadCell>Quantite</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Facture reference</Table.HeadCell>
                  <Table.HeadCell>Motif</Table.HeadCell>
                  <Table.HeadCell>Etat OBR</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {loadingProduit && (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={8}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer  text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           <Spinner />
                        </Table.Cell>
                     </Table.Row>
                  )}
                  {mouvements?.map((item) => (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        key={item.id}
                     >
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           <span className="text-blue-800">
                              {item.produit.nom}
                           </span>
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.prix_revien} BIF
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.type_mouvement === 'EN'
                              ? 'Entrée normale'
                              : item.type_mouvement === 'EAJ'
                                ? 'Entrée ajustement stock'
                                : item.type_mouvement === 'EI'
                                  ? 'Entrée inventaire'
                                  : item.type_mouvement === 'ET'
                                    ? 'Entrée transfert'
                                    : item.type_mouvement === 'EAU'
                                      ? 'Autre entrée'
                                      : item.type_mouvement === 'SN'
                                        ? 'Sortie normale'
                                        : item.type_mouvement === 'SAJ'
                                          ? 'Sortie ajustement'
                                          : item.type_mouvement === 'SC'
                                            ? 'Sortie casse'
                                            : item.type_mouvement === 'SP'
                                              ? 'Sortie perte'
                                              : item.type_mouvement === 'ST'
                                                ? 'Sortie transfert stock'
                                                : item.type_mouvement === 'SV'
                                                  ? 'Sortie vol'
                                                  : item.type_mouvement ===
                                                      'SAU'
                                                    ? 'sortie autre'
                                                    : item.type_mouvement ===
                                                        'ER'
                                                      ? 'Entrée en cas de retour de marchandise'
                                                      : item.type_mouvement}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.quantite} {item.unite_mesure.libelle}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.createAt
                              ? item.createAt
                                   .toISOString()
                                   .split('.')[0]
                                   .replace('T', ' ')
                              : ''}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.facture?.numero_facture}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.motif}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                        >
                           {item.envoyer_obr ? (
                              <span className="text-green-600">Envoyé</span>
                           ) : (
                              <span className="text-red-600">en attente</span>
                           )}
                        </Table.Cell>
                     </Table.Row>
                  ))}
                  {!loadingProduit && mouvements.length < 1 && (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={6}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer  text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           {error ? (
                              <span>
                                 Please check your internet connexion...
                              </span>
                           ) : (
                              'Pas de produit ou service'
                           )}
                        </Table.Cell>
                     </Table.Row>
                  )}
               </Table.Body>
            </Table>
         </div>
      </div>
   )
}
