'use client'
import { get_article_action } from '@/actions/article_action'
import {
   BtnBack,
   BtnRefresh,
   SearchBar,
} from '@/app/(dashboard)/facturation/_components/content'
import { Prisma } from '@prisma/client'
import { Spinner, Table } from 'flowbite-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const pIncludes = Prisma.validator<Prisma.ProduitDefaultArgs>()({
   include: { unite_mesure: true, categorie: true },
})
type ProduitUniteMesure = Prisma.ProduitGetPayload<typeof pIncludes>
export default function SelectProduct({
   setSelectProduit,
   setShowSelectProduct,
}: {
   setSelectProduit: (produit: ProduitUniteMesure) => void
   setShowSelectProduct: (show: boolean) => void
}) {
   const [searchWord, setSearchWord] = useState('')
   const [data, setData] = useState<ProduitUniteMesure[]>([])
   const [loadingCategorie, setLoadingCategorie] = useState(true)
   const [error] = useState(false)
   useEffect(() => {
      setLoadingCategorie(true)
      get_article_action(searchWord)
         .then((data): void => {
            setData(data)
            setLoadingCategorie(false)
         })
         .catch((err) => console.log(err))
   }, [searchWord])

   const handdleSearch = (e: FormEvent<HTMLInputElement>) => {
      if (!e) return
      const word = (e as ChangeEvent<HTMLInputElement>).target.value
      setSearchWord(word)
   }

   return (
      <div>
         <h2 className="text-center font-bold">
            Selectionner le produit ou le service à ajouter à la facture
         </h2>
         <div className="flex w-full flex-col gap-4 p-4">
            <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
               <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
                  <BtnBack handler={() => setShowSelectProduct(false)} />
                  <>
                     <BtnRefresh />
                  </>
               </div>
               <SearchBar
                  handdleSearch={handdleSearch}
                  className="w-full flex-1 "
                  title="un produit"
               />
               {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
            </div>

            <div className="h-[70vh] overflow-auto">
               <Table>
                  <Table.Head>
                     <Table.HeadCell>Nom du produit</Table.HeadCell>
                     <Table.HeadCell>Quantité</Table.HeadCell>
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
                           key={item.id}
                           onClick={() => setSelectProduit(item)}
                        >
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                           >
                              {item.nom}
                           </Table.Cell>
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                           >
                              {' '}
                              {item.stockable
                                 ? item.stock_actuel +
                                   ' ' +
                                   item.unite_mesure.libelle
                                 : 'service'}
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
                                 'No Data to Display'
                              )}
                           </Table.Cell>
                        </Table.Row>
                     )}
                  </Table.Body>
               </Table>
            </div>
         </div>
      </div>
   )
}
