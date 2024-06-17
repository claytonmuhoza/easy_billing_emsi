'use client'

import { get_log_obr } from '@/actions/log_obr_action'
import { LogOBR } from '@prisma/client'
import { Button, Spinner, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
// interface ClientListProps {
//    categories: Categorie[]
// }

export default function CategorieList() {
   const [logs, setLogs] = useState<LogOBR[]>([])
   const [loadingLogs, setLoadingLogs] = useState(true)
   const [error] = useState(false)
   useEffect(() => {
      setLoadingLogs(true)
      get_log_obr()
         .then((data): void => {
            setLogs(data)
            setLoadingLogs(false)
         })
         .catch((err) => console.log(err))
   }, [])

   return (
      <div className="flex w-full flex-col gap-4 p-4">
         <div className="h-[70vh] overflow-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>Lien</Table.HeadCell>
                  <Table.HeadCell>Methode</Table.HeadCell>
                  <Table.HeadCell>status</Table.HeadCell>
                  <Table.HeadCell>Message</Table.HeadCell>
                  <Table.HeadCell>result</Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {loadingLogs && (
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
                  {logs?.map((item) => (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        key={item.id}
                     >
                        <Table.Cell
                           aria-controls="facture"
                           aria-expanded
                           className="cursor-pointer whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        >
                           {item.lien}
                        </Table.Cell>

                        <Table.Cell>{item.methode}</Table.Cell>
                        <Table.Cell>{item.code_reponse}</Table.Cell>
                        <Table.Cell>{item.message_reponse}</Table.Cell>
                        <Table.Cell>
                           {item.result && item.result !== '' ? (
                              <Button onClick={() => alert(item.result)}>
                                 Voir
                              </Button>
                           ) : (
                              ''
                           )}
                        </Table.Cell>
                     </Table.Row>
                  ))}
                  {!loadingLogs && logs.length < 1 && (
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
                                 Verifier si la base de donnée est en ligne...
                              </span>
                           ) : (
                              'Pas de données'
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
