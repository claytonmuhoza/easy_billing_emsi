'use client'
// import { allCategorie } from '@/actions/categorie_action'
import { get_all_banque_action } from '@/actions/banque_action'
import { useBanqueContext } from '@/context/BanqueContext'
import { Banque } from '@prisma/client'
import { Spinner, Table, Tooltip } from 'flowbite-react'
import { FormEvent, useEffect, useState } from 'react'
import { HiPencil } from 'react-icons/hi'
import {
   BtnBack,
   BtnCreate,
   BtnRefresh,
   SearchBar,
} from '../../facturation/_components/content'
// interface ClientListProps {
//    categories: Categorie[]
// }

export default function CategorieList() {
   const [data, setData] = useState<Banque[]>([])
   const [searchWord, setSearchWord] = useState('')
   const [loadingCategorie, setLoadingCategorie] = useState(true)
   const { banqueModalState, openModal } = useBanqueContext()
   const [error] = useState(false)
   useEffect(() => {
      setLoadingCategorie(true)
      get_all_banque_action(searchWord)
         .then((data): void => {
            setData(data)
            setLoadingCategorie(false)
         })
         .catch((err) => console.log(err))
   }, [banqueModalState, searchWord])

   const handdleSearch = (e: FormEvent<HTMLInputElement>) => {
      const word = e.currentTarget.value

      setSearchWord(word)
   }

   return (
      <div className="flex w-full flex-col gap-4 p-4">
         {searchWord}
         <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  {<BtnBack />}
                  <BtnRefresh />
                  <BtnCreate
                     name="Nouvelle Banque"
                     onClick={() => openModal('create')}
                  />
               </>
            </div>
            <SearchBar
               handdleSearch={handdleSearch}
               className="w-full flex-1 "
               title="une Banque"
            />
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </div>

         <div className="h-[70vh] overflow-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>Nom de la Banque</Table.HeadCell>
                  <Table.HeadCell>N° Compte</Table.HeadCell>
                  {/* <Table.HeadCell>Nom Compte</Table.HeadCell>
                  <Table.HeadCell>Iban Code</Table.HeadCell>
                  <Table.HeadCell>Swift Code</Table.HeadCell>
                  <Table.HeadCell>Intermediary Bank</Table.HeadCell>
                  <Table.HeadCell>Swift Code</Table.HeadCell> */}
                  <Table.HeadCell>Action</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {loadingCategorie && (
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
                  )}
                  {data?.map((item) => (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        key={
                           item.id +
                           'cats' +
                           Math.floor(Math.random() * 1200).toString()
                        }
                     >
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           // onClick={() => {
                           //    openModal('details', item)
                           // }}
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           {item.nom_bank}
                        </Table.Cell>
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           // onClick={() => {
                           //    openModal('details', item)
                           // }}
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           {item.numero_compte}
                        </Table.Cell>

                        <Table.Cell>
                           <div className="flex flex-row items-center gap-2">
                              <button
                                 className="bg-transparent dark:bg-transparent"
                                 onClick={() => openModal('edit', item)}
                              >
                                 <Tooltip
                                    className="text-3"
                                    content={'Modifier'}
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
                           </div>
                        </Table.Cell>
                     </Table.Row>
                  ))}
                  {!loadingCategorie && data.length < 1 && (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={6}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           {error ? (
                              <span>
                                 Please check your internet connexion...
                              </span>
                           ) : (
                              'Pas de banque'
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
