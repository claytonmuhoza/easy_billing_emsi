'use client'
import { auto_send_action } from '@/actions/auto_send'
import { get_all_FN, get_all_FN_en_cours } from '@/actions/facture_action'
import { useFacturationContext } from '@/context/FacturationContext'
import { afficherDateHeure } from '@/helpers/url'
import { DetailFacture, Prisma } from '@prisma/client'
import { Spinner, Table, Tooltip } from 'flowbite-react'
import { FormEvent, useEffect, useState } from 'react'
import { HiEye, HiPencil, HiPrinter, HiTrash } from 'react-icons/hi'
import { arrondir_fbu } from '../../_components/util_javascript'
import { BtnBack, BtnCreate, BtnRefresh, SearchBar } from './content'
// import { Link } from 'react-router-dom'
// import {
//    ActiveTag,
//    BtnBack,
//    BtnCreate,
//    BtnRefresh,
//    SponsoredTag,
// } from '../../components/factureEssentiels'
// import Layout from '../../components/Layout'
// import { MyLoader } from '../../components/Loader'
// import { SearchBar } from '../../components/NavBar'
// import { apiLink } from '../../utilis/ApiContext'
// import { PopUpContext } from '../../utilis/Context'
// import { updateDataIfNeeded, useFetch } from '../../utilis/CustomHooks'
const fIncludes = Prisma.validator<Prisma.FactureDefaultArgs>()({
   include: {
      details_facture: true,
      client: true,
      societe: true,
      banque: true,
   },
})
type Facture = Prisma.FactureGetPayload<typeof fIncludes>
export default function FacturesList() {
   const [isLoading, setLoading] = useState(true)
   const [data, setData] = useState<Facture[]>([])
   const [loadingFactureEnCours, setLoadingFactureEnCours] = useState(true)
   const [factureEnCours, setFactureEnCours] = useState<Facture[]>([])
   const [searchWord, setSearchWord] = useState('')
   const { openModal } = useFacturationContext()
   const thousandSeparator = (n: number, sep: string | undefined) => {
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
   const totalFacture = (details: DetailFacture[]) => {
      let somme = 0
      if (details.length > 0) {
         for (const detail of details) {
            somme += arrondir_fbu(
               (detail.prix_unitaire_vente_hors_tva +
                  detail.prix_unitaire_tva) *
                  detail.quantite,
            )
         }
      }
      return somme
   }
   const handdleSearch = (e: FormEvent<HTMLInputElement>) => {
      const word = e.currentTarget.value
      setSearchWord(word)
   }

   useEffect(() => {
      setLoadingFactureEnCours(true)
      setLoading(true)
      get_all_FN_en_cours(searchWord).then((data) => {
         setFactureEnCours(data)
         setLoadingFactureEnCours(false)
      })

      get_all_FN(searchWord)
         .then((data) => {
            setData(data)
            setLoading(false)
         })
         .catch(() => {
            setLoading(false)
         })
      auto_send_action()
   }, [openModal, searchWord])
   return (
      <div className="flex w-full flex-col gap-4 p-4">
         <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  <BtnBack />
                  <BtnRefresh />
                  <BtnCreate
                     name="Nouvelle Facture"
                     onClick={() => openModal('create')}
                  />
               </>
            </div>
            <SearchBar
               handdleSearch={handdleSearch}
               className="w-full flex-1"
               title="Facture"
            />
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </div>
         <div className="overflow-x-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>N°</Table.HeadCell>
                  <Table.HeadCell>Date de Facturation</Table.HeadCell>
                  <Table.HeadCell>Nom du Client</Table.HeadCell>

                  <Table.HeadCell>NIF du Client</Table.HeadCell>
                  <Table.HeadCell>Montant</Table.HeadCell>
                  <Table.HeadCell>Devise</Table.HeadCell>
                  <Table.HeadCell>Paiement</Table.HeadCell>
                  <Table.HeadCell>Status System</Table.HeadCell>
                  <Table.HeadCell>Status OBR</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {isLoading ? (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={10}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           <Spinner />
                        </Table.Cell>
                     </Table.Row>
                  ) : data.length === 0 && factureEnCours.length === 0 ? (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={10}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer  text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           <span>Pas de facture</span>
                        </Table.Cell>
                     </Table.Row>
                  ) : (
                     <>
                        {loadingFactureEnCours ? (
                           <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                              // key={facture.id + 'factures'}
                           >
                              <Table.Cell
                                 colSpan={10}
                                 // onClick={() => changefacture(facture)}
                                 className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                              >
                                 Chargement des factures en cours ...
                              </Table.Cell>
                           </Table.Row>
                        ) : (
                           factureEnCours?.map((facture) => (
                              <Table.Row
                                 className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                 key={facture.id + 'factures'}
                              >
                                 <Table.Cell
                                    aria-controls="facture"
                                    aria-expanded
                                    onClick={() => {
                                       openModal('details', facture)
                                    }}
                                    className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                 >
                                    {facture.numero_facture}
                                 </Table.Cell>
                                 <Table.Cell
                                    className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                    onClick={() => {
                                       openModal('details', facture)
                                    }}
                                 >
                                    {facture.date_paiement
                                       ? afficherDateHeure(
                                            facture.date_paiement,
                                         )
                                       : ''}
                                 </Table.Cell>
                                 <Table.Cell
                                    className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                    onClick={() => {
                                       openModal('details', facture)
                                    }}
                                 >
                                    {facture.client.nom}
                                 </Table.Cell>

                                 <Table.Cell
                                    className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                    onClick={() => {
                                       openModal('details', facture)
                                    }}
                                 >
                                    {facture.client.NIF}
                                 </Table.Cell>
                                 <Table.Cell>
                                    <span className="font-bold text-green-800">
                                       {thousandSeparator(
                                          totalFacture(facture.details_facture),
                                          ' ',
                                       )}
                                    </span>
                                 </Table.Cell>
                                 <Table.Cell>{facture.devise}</Table.Cell>
                                 <Table.Cell>
                                    {facture.ModePaiement === '1'
                                       ? 'Espèce'
                                       : facture.ModePaiement === '2'
                                         ? 'banque'
                                         : facture.ModePaiement === '3'
                                           ? 'crédit'
                                           : 'autre'}
                                 </Table.Cell>
                                 <Table.Cell>
                                    {facture.etat_facture ? (
                                       facture.etat_facture ===
                                       'non_validee' ? (
                                          <>En cours</>
                                       ) : facture.etat_facture ===
                                         'validee' ? (
                                          <>Validée</>
                                       ) : (
                                          <>{facture.etat_facture}</>
                                       )
                                    ) : (
                                       ''
                                    )}
                                 </Table.Cell>
                                 <Table.Cell>
                                    {facture.etat_facture === 'annuler' ? (
                                       facture.annulation_send_to_obr ? (
                                          <span className="text-green-600">
                                             Annulation envoyer
                                          </span>
                                       ) : (
                                          <span className="text-yellow-600">
                                             annulation en attente
                                          </span>
                                       )
                                    ) : facture.sended_to_obr ? (
                                       <span className="text-green-600">
                                          envoyer
                                       </span>
                                    ) : (
                                       <span className="text-yellow-600">
                                          en attente
                                       </span>
                                    )}
                                 </Table.Cell>
                                 <Table.Cell>
                                    <div className="flex flex-row items-center gap-2">
                                       {facture.etat_facture === 'validee' ? (
                                          <>
                                             <button
                                                className="bg-transparent"
                                                onClick={() => {
                                                   openModal('details', facture)
                                                }}
                                             >
                                                <Tooltip
                                                   className="text-3"
                                                   content={'Print facture'}
                                                   placement="top"
                                                   style="auto"
                                                >
                                                   <HiPrinter
                                                      // onClick={() =>
                                                      //    openFormEditModal(facture)
                                                      // }
                                                      className="cursor-pointer text-6 text-blue-600"
                                                   />
                                                </Tooltip>
                                             </button>
                                             <button
                                                className="bg-transparent"
                                                onClick={() => {
                                                   openModal('annuler', facture)
                                                }}
                                             >
                                                <Tooltip
                                                   className="text-3"
                                                   content={'Delete facture'}
                                                   placement="top"
                                                   style="auto"
                                                >
                                                   <HiTrash className="cursor-pointer text-6 text-red-700" />
                                                </Tooltip>
                                             </button>
                                          </>
                                       ) : (
                                          <>
                                             <button
                                                className="bg-transparent"
                                                onClick={() => {
                                                   openModal('details', facture)
                                                }}
                                             >
                                                <Tooltip
                                                   className="text-3"
                                                   content={'edit facture'}
                                                   placement="top"
                                                   style="auto"
                                                >
                                                   <HiPencil
                                                      // onClick={() =>
                                                      //    openFormEditModal(facture)
                                                      // }
                                                      className="cursor-pointer text-6 text-blue-600"
                                                   />
                                                </Tooltip>
                                             </button>
                                             <button
                                                className="bg-transparent"
                                                onClick={() => {
                                                   openModal(
                                                      'supprimer',
                                                      facture,
                                                   )
                                                }}
                                             >
                                                <Tooltip
                                                   className="text-3"
                                                   content={'Delete facture'}
                                                   placement="top"
                                                   style="auto"
                                                >
                                                   <HiTrash className="cursor-pointer text-6 text-red-700" />
                                                </Tooltip>
                                             </button>
                                          </>
                                       )}
                                    </div>
                                 </Table.Cell>
                              </Table.Row>
                           ))
                        )}
                        {data?.map((facture) => (
                           <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                              key={facture.id + 'factures'}
                           >
                              <Table.Cell
                                 aria-controls="facture"
                                 aria-expanded
                                 onClick={() => {
                                    openModal('details', facture)
                                 }}
                                 className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                              >
                                 {facture.numero_facture}
                              </Table.Cell>
                              <Table.Cell
                                 className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                 onClick={() => {
                                    openModal('details', facture)
                                 }}
                              >
                                 {facture.date_paiement
                                    ? afficherDateHeure(facture.date_paiement)
                                    : ''}
                              </Table.Cell>
                              <Table.Cell
                                 className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                 onClick={() => {
                                    openModal('details', facture)
                                 }}
                              >
                                 {facture.client.nom}
                              </Table.Cell>

                              <Table.Cell
                                 className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                                 onClick={() => {
                                    openModal('details', facture)
                                 }}
                              >
                                 {facture.client.NIF}
                              </Table.Cell>
                              <Table.Cell>
                                 <span className="font-bold text-green-800">
                                    {thousandSeparator(
                                       totalFacture(facture.details_facture),
                                       ' ',
                                    )}
                                 </span>
                              </Table.Cell>
                              <Table.Cell>{facture.devise}</Table.Cell>
                              <Table.Cell>
                                 {facture.ModePaiement === '1'
                                    ? 'Espèce'
                                    : facture.ModePaiement === '2'
                                      ? 'banque'
                                      : facture.ModePaiement === '3'
                                        ? 'crédit'
                                        : 'autre'}
                              </Table.Cell>
                              <Table.Cell>
                                 {facture.etat_facture ? (
                                    <>{facture.etat_facture}</>
                                 ) : (
                                    ''
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {facture.etat_facture === 'annuler' ? (
                                    facture.annulation_send_to_obr ? (
                                       <span className="text-green-600">
                                          Annulation envoyer
                                       </span>
                                    ) : (
                                       <span className="text-yellow-600">
                                          annulation en attente
                                       </span>
                                    )
                                 ) : facture.sended_to_obr ? (
                                    <span className="text-green-600">
                                       envoyer
                                    </span>
                                 ) : (
                                    <span className="text-yellow-600">
                                       en attente
                                    </span>
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 <div className="flex flex-row items-center gap-2">
                                    {facture.etat_facture === 'validee' ? (
                                       <>
                                          <button
                                             className="bg-transparent"
                                             onClick={() => {
                                                openModal('details', facture)
                                             }}
                                          >
                                             <Tooltip
                                                className="text-3"
                                                content={'Print facture'}
                                                placement="top"
                                                style="auto"
                                             >
                                                <HiPrinter
                                                   // onClick={() =>
                                                   //    openFormEditModal(facture)
                                                   // }
                                                   className="cursor-pointer text-6 text-blue-600"
                                                />
                                             </Tooltip>
                                          </button>
                                          <button
                                             className="bg-transparent"
                                             onClick={() => {
                                                openModal('annuler', facture)
                                             }}
                                          >
                                             <Tooltip
                                                className="text-3"
                                                content={'Delete facture'}
                                                placement="top"
                                                style="auto"
                                             >
                                                <HiTrash className="cursor-pointer text-6 text-red-700" />
                                             </Tooltip>
                                          </button>
                                       </>
                                    ) : (
                                       <>
                                          <button
                                             className="bg-transparent"
                                             onClick={() => {
                                                openModal('details', facture)
                                             }}
                                          >
                                             <Tooltip
                                                className="text-3"
                                                content={'Print facture'}
                                                placement="top"
                                                style="auto"
                                             >
                                                <HiEye
                                                   // onClick={() =>
                                                   //    openFormEditModal(facture)
                                                   // }
                                                   className="cursor-pointer text-6 text-blue-600"
                                                />
                                             </Tooltip>
                                          </button>
                                       </>
                                    )}
                                 </div>
                              </Table.Cell>
                           </Table.Row>
                        ))}
                     </>
                  )}
               </Table.Body>
            </Table>
         </div>
      </div>
   )
}
