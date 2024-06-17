'use client'
import { allUniteMesure } from '@/actions/unite_mesure_action'
import { useUniteMesureContext } from '@/context/UniteMesureContext'
import { UniteMesure } from '@prisma/client'
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

export default function UniteMesureList() {
   const [data, setData] = useState<UniteMesure[]>([])
   const [unitesMesures, setUnitesMesure] = useState<UniteMesure[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const { uniteMesureModalState, openModal } = useUniteMesureContext()
   const [refresh, setRefresh] = useState(false)
   const [error] = useState(false)
   useEffect(() => {
      setIsLoading(true)
      allUniteMesure().then((data) => {
         setData(data)
         setUnitesMesure(data)
         setIsLoading(false)
      })
      setRefresh(false)
   }, [uniteMesureModalState, refresh])

   const handdleSearch = (e: FormEvent<HTMLInputElement>) => {
      const word = e.currentTarget.value
      word.length > 3
         ? setData(
              unitesMesures.filter(({ libelle }) => {
                 return libelle?.toLowerCase().includes(word.toLowerCase())
              }),
           )
         : setData(unitesMesures)
   }

   return (
      <div className="flex w-full flex-col gap-4 p-4">
         <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  {<BtnBack />}
                  <BtnRefresh onClick={() => setRefresh(true)} />
                  <BtnCreate
                     name="Unité de Mesure"
                     onClick={() => openModal('create')}
                  />
               </>
            </div>
            <SearchBar
               handdleSearch={handdleSearch}
               className="w-full flex-1 "
               title="une Unité de Mesure"
            />
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </div>

         <div className="h-[70vh] overflow-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>Nom</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {isLoading && (
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
                        key={item.id}
                     >
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           onClick={() => {
                              openModal('details', item)
                           }}
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           {item.libelle}
                        </Table.Cell>

                        <Table.Cell>
                           <div className="flex flex-row items-center gap-2">
                              <button
                                 className="bg-transparent"
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
                  {!isLoading && data.length < 1 && (
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
                              'No Data to Display'
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
