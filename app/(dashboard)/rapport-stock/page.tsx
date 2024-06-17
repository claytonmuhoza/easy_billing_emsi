'use client'

import { rapport_stock_action } from '@/actions/rapport_stock_action'

import { rapport_stock_filter_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Prisma } from '@prisma/client'
import { Button, Spinner, Table } from 'flowbite-react'
import { useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { utils, writeFile } from 'xlsx'
import { z } from 'zod'
import { BtnRefresh } from '../facturation/_components/content'
import { sumTotalEntree, sumTotalSortie } from './function_calcule'
import { transformRapport } from './generate_rapport_stock'
const RapportStock = () => {
   const mIncludes = Prisma.validator<Prisma.ProduitFindManyArgs>()({
      include: { mouvements_stock: true },
   })
   type ProduitStockType = Prisma.ProduitGetPayload<typeof mIncludes>
   const [isPending, startTransition] = useTransition()
   const [rapports, setRapport] = useState<ProduitStockType[]>([])
   const [loading, setLoading] = useState(true)
   const [isRefresh, setRefresh] = useState(false)
   const handleDownLoad = () => {
      const wb = utils.book_new()
      const ws = utils.json_to_sheet(transformRapport(rapports))
      utils.book_append_sheet(wb, ws, 'Rapport de stocK')
      writeFile(
         wb,
         'Rapport de stock du ' +
            new Date().toISOString().split('.')[0].replace('T', '') +
            '.xlsx',
      )
   }
   const handleRefresh = () => {
      setRefresh(!isRefresh)
   }
   useEffect(() => {
      setLoading(true)
      rapport_stock_action({ date_debut: undefined, date_fin: undefined })
         .then((data) => {
            setRapport(data)
            setLoading(false)
         })
         .catch(() => {
            setLoading(false)
         })
   }, [isRefresh])
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
   const onSubmit = (values: z.infer<typeof rapport_stock_filter_schema>) => {
      startTransition(() => {
         setLoading(true)
         rapport_stock_action(values)
            .then((data) => {
               setRapport(data), setLoading(false)
            })
            .catch(() => {
               setLoading(false)
            })
      })
   }

   const form = useForm<z.infer<typeof rapport_stock_filter_schema>>({
      resolver: zodResolver(rapport_stock_filter_schema),
      defaultValues: { date_debut: undefined, date_fin: undefined },
   })
   return (
      <div className="mx-2 h-screen">
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="justify my-3 flex flex-col items-center gap-2 rounded bg-white p-2 dark:bg-gray-800 sm:flex-row  sm:gap-4 "
         >
            <div className="justify- flex flex-row items-center gap-2 sm:gap-4 sm-max:w-full">
               <>
                  <BtnRefresh onClick={() => handleRefresh()} />
               </>
            </div>
            <div className="flex items-center gap-2">
               Début:{' '}
               <Controller
                  control={form.control}
                  name="date_debut"
                  render={({ field }) => <input {...field} type="date" />}
               />
            </div>
            <div className="flex items-center gap-2">
               Fin:{' '}
               <Controller
                  control={form.control}
                  name="date_fin"
                  render={({ field }) => <input {...field} type="date" />}
               />
            </div>
            <Button type="submit" disabled={isPending}>
               Rechercher
            </Button>
            <Button
               className="dark:bg-orimary bg-primary"
               onClick={() => handleDownLoad()}
            >
               Télécharger
            </Button>
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </form>

         <div className="mt-3 overflow-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>N.</Table.HeadCell>
                  <Table.HeadCell>Nom produit</Table.HeadCell>
                  <Table.HeadCell>Stock actuel</Table.HeadCell>
                  <Table.HeadCell>Entrée</Table.HeadCell>
                  <Table.HeadCell>Sortie autre</Table.HeadCell>
                  <Table.HeadCell>prix de revient</Table.HeadCell>
                  <Table.HeadCell>Stock * prix de revient</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {loading ? (
                     <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                        <Table.Cell colSpan={7}>
                           <div className="flex justify-center">
                              <Spinner />
                           </div>
                        </Table.Cell>
                     </Table.Row>
                  ) : (
                     rapports.map((produit, index) => (
                        <Table.Row
                           className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                           key={produit.id}
                        >
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                           >
                              {index + 1}
                           </Table.Cell>
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                           >
                              {produit.nom}
                           </Table.Cell>
                           <Table.Cell>{produit.stock_actuel}</Table.Cell>

                           <Table.Cell>
                              {sumTotalEntree(produit.mouvements_stock)}
                           </Table.Cell>

                           <Table.Cell>
                              {sumTotalSortie(produit.mouvements_stock)}
                           </Table.Cell>
                           <Table.Cell>
                              {thousandSeparator(produit.prix_unitaire_revien)}{' '}
                              BIF
                           </Table.Cell>
                           <Table.Cell>
                              {thousandSeparator(
                                 produit.prix_unitaire_revien *
                                    produit.stock_actuel,
                              )}{' '}
                              BIF
                           </Table.Cell>
                        </Table.Row>
                     ))
                  )}
               </Table.Body>
            </Table>
         </div>
      </div>
   )
}
export default RapportStock
