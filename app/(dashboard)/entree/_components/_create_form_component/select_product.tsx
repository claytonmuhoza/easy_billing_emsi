'use client'
import { get_article_stockable } from '@/actions/get_article_action'
import {
   BtnRefresh,
   SearchBar,
} from '@/app/(dashboard)/facturation/_components/content'
import { Prisma } from '@prisma/client'
import { Spinner, Table } from 'flowbite-react'
import { FormEvent, useEffect, useState } from 'react'

const pIncludes = Prisma.validator<Prisma.ProduitDefaultArgs>()({
   include: { unite_mesure: true, categorie: true },
})
type ProduitUniteMesure = Prisma.ProduitGetPayload<typeof pIncludes>
export default function SelectProduct({
   setSelectProduit,
}: {
   setSelectProduit: (produit: ProduitUniteMesure) => void
}) {
   const [data, setData] = useState<ProduitUniteMesure[]>([])
   const [loadingCategorie, setLoadingCategorie] = useState(true)
   const [error] = useState(false)
   const [searchWord, setSearchWord] = useState('')
   const [actualiser, setActualiser] = useState(false)
   useEffect(() => {
      get_article_stockable(searchWord)
         .then((data): void => {
            setData(data)
            setLoadingCategorie(false)
         })
         .catch((err) => console.log(err))
   }, [searchWord, actualiser])

   const handdleSearch = (e: FormEvent<HTMLInputElement>) => {
      if (!e) return
      const word = e.currentTarget.value

      setSearchWord(word)
   }
   const handleActualiser = () => {
      setActualiser(!actualiser)
   }
   return (
      <div className="flex w-full flex-col gap-4 p-4">
         <div className="justify- flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 ">
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  <BtnRefresh
                     onClick={() => {
                        setLoadingCategorie(true)
                        handleActualiser()
                     }}
                  />
               </>
            </div>
            <SearchBar
               handdleSearch={handdleSearch}
               className="w-full flex-1 "
               title="une Categorie"
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
                           {item.stock_actuel + ' ' + item.unite_mesure.libelle}
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
   )
}
