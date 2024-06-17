'use facture?.client'

import { useFacturationContext } from '@/context/FacturationContext'
import { getCurrentSociete } from '@/data/contribuable'
import { Societe } from '@prisma/client'
import { Table } from 'flowbite-react'
import { useEffect, useState } from 'react'

export default function ViewFacture() {
   const { facture } = useFacturationContext()
   const [societe, setSociete] = useState<Societe | undefined>()
   // const societe = await getSociete()
   useEffect(() => {
      ;[]
      getCurrentSociete().then((data) => {
         if (data) {
            setSociete(data)
         }
      })
   })

   return (
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3">
         <div className="flex w-full flex-col gap-2 px-4">
            <table>
               <tr className="flex w-full flex-row justify-between">
                  <td className="flex flex-col">
                     {' '}
                     <div className="flex w-full flex-row items-center justify-start gap-4 ">
                        <span className="text-6 font-bold text-primary sm:text-8">
                           Easy
                        </span>
                        <span className="text-6 font-bold text-dark dark:text-slate-200  sm:text-8">
                           {' '}
                           | BILLING
                        </span>
                     </div>
                  </td>
                  {societe && (
                     <td className="flex flex-col text-right">
                        <span className="text-right">{societe.nom}</span>
                        <span className="text-right">{societe.nif}</span>
                        <span className="text-right">{societe.telephone}</span>
                        <span className="text-right">{societe.email}</span>
                     </td>
                  )}
               </tr>
            </table>
            <div className="flex flex-col">
               <span>FACTURE NO 001</span>
               <span>DATE DE FACTURATION : {new Date().toDateString()}</span>
            </div>
            <div className="flex flex-col">
               <span>FACTURÉ À : </span>
               <span>{facture?.client?.nom}</span>
               <span>{facture?.client?.adresse}</span>
            </div>
            <div className="overflow-x-auto">
               <Table>
                  <Table.Head>
                     <Table.HeadCell>Designation</Table.HeadCell>
                     <Table.HeadCell>Qnté</Table.HeadCell>
                     <Table.HeadCell>P.U</Table.HeadCell>

                     <Table.HeadCell>TOTAL</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                     <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           PRIMUS BLACK
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           12
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           1000
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           12000
                        </Table.Cell>
                     </Table.Row>
                     <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           PRIMUS BLACK
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           12
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           1000
                        </Table.Cell>
                        <Table.Cell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           12000
                        </Table.Cell>
                     </Table.Row>

                     {!facture && (
                        <Table.Row
                           className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                           // key={facture.id + 'factures'}
                        >
                           <Table.Cell
                              colSpan={6}
                              // onClick={() => changefacture(facture)}
                              className="cursor-pointer whitespace-nowrap text-center font-medium text-gray-900 dark:text-red-500"
                           >
                              {'No Data to Display'}
                           </Table.Cell>
                        </Table.Row>
                     )}
                  </Table.Body>
                  {facture && (
                     <Table.Head className="rounded-b-mb">
                        <Table.HeadCell
                           aria-controls="facture"
                           aria-expanded
                           colSpan={3}
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           TOTAL
                        </Table.HeadCell>

                        <Table.HeadCell className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white">
                           24000
                        </Table.HeadCell>
                     </Table.Head>
                  )}
               </Table>
            </div>
         </div>
      </div>
   )
}
