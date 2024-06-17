'use client'
import { rapport_vente_action } from '@/actions/rapport_vente'
import { afficherDateHeure } from '@/helpers/url'
import { rapport_vente_filter_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Client, DetailFacture, Prisma } from '@prisma/client'
import { Button, Spinner, Table } from 'flowbite-react'
import { useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { utils, writeFile } from 'xlsx'
import { z } from 'zod'
import { arrondir_fbu } from '../_components/util_javascript'
import { BtnRefresh } from '../facturation/_components/content'
import {
   totalChiffreAffaire,
   total_tva_chiffre_affaire,
   transform_rapport_vente,
} from './generate_rapport_vente'
const fIncludes = Prisma.validator<Prisma.FactureDefaultArgs>()({
   include: {
      details_facture: true,
      client: true,
      societe: true,
      banque: true,
   },
})
type Facture = Prisma.FactureGetPayload<typeof fIncludes>
const RapportVente = ({ client }: { client?: Client }) => {
   const handleDownLoad = () => {
      const wb = utils.book_new()
      const ws = utils.json_to_sheet(transform_rapport_vente(rapportVente))
      utils.book_append_sheet(wb, ws, 'Rapport de stocK')
      writeFile(
         wb,
         'Rapport de vente du ' +
            new Date().toISOString().split('.')[0].replace('T', '') +
            '.xlsx',
      )
   }
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
   const [isPending, startTransition] = useTransition()
   const [isLoading, setLoading] = useState(false)
   const [rapportVente, setRapportVente] = useState<Facture[]>([])
   const [refresh, setRefresh] = useState(false)
   const handleRefresh = () => {
      setRefresh(!refresh)
   }
   useEffect(() => {
      setLoading(true)
      rapport_vente_action(
         {
            date_debut: undefined,
            date_fin: undefined,
            type_facture: 'valide',
         },
         client?.id,
      )
         .then((data) => {
            setLoading(false), setRapportVente(data)
         })
         .catch((e) => {
            setLoading(false)
            alert(JSON.stringify(e + ''))
         })
   }, [refresh, client?.id])
   const onSubmit = (values: z.infer<typeof rapport_vente_filter_schema>) => {
      startTransition(() => {
         setLoading(true)
         rapport_vente_action(values)
            .then((data) => {
               setRapportVente(data), setLoading(false)
            })
            .catch(() => {
               setLoading(false)
            })
      })
   }

   const form = useForm<z.infer<typeof rapport_vente_filter_schema>>({
      resolver: zodResolver(rapport_vente_filter_schema),
      defaultValues: {
         date_debut: undefined,
         date_fin: undefined,
         type_facture: 'valide',
      },
   })
   return (
      <div>
         {client ? (
            <div className="border-b border-gray-700 pb-3 pt-3">
               <div>
                  <h1 className=" font-bold">Nom du client: {client.nom}</h1>
                  <div>
                     <span>
                        Assujettit à la TVA:{' '}
                        {client.assujetti_tva ? 'Oui' : 'Non'}
                     </span>
                  </div>
                  <div>
                     <span>Nif du client: {client.NIF}</span>
                  </div>
                  <div>
                     <span>adresse du client: {client.adresse}</span>
                  </div>
               </div>
            </div>
         ) : (
            <></>
         )}
         <div className="p-2">
            <div>
               Total du chiffre d'affaire:{' '}
               <span className="font-bold">
                  {thousandSeparator(totalChiffreAffaire(rapportVente), ' ')}{' '}
                  FBU
               </span>
            </div>
            <div>
               Total TVA:{' '}
               <span className="font-bold">
                  {thousandSeparator(
                     total_tva_chiffre_affaire(rapportVente),
                     ' ',
                  )}{' '}
                  FBU
               </span>
            </div>
         </div>
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
               onClick={handleDownLoad}
            >
               Télécharger
            </Button>
            {/*<Datepicker onSelectedDateChanged={(e) => changeDate(e)} /> */}
         </form>

         <div className="overflow-x-auto">
            <Table>
               <Table.Head>
                  <Table.HeadCell>N°</Table.HeadCell>
                  <Table.HeadCell>Date de Facturation</Table.HeadCell>
                  {client ? (
                     <></>
                  ) : (
                     <>
                        <Table.HeadCell>Nom du Client</Table.HeadCell>

                        <Table.HeadCell>NIF du Client</Table.HeadCell>
                     </>
                  )}
                  <Table.HeadCell>Montant</Table.HeadCell>
                  <Table.HeadCell>Devise</Table.HeadCell>
                  <Table.HeadCell>Paiement</Table.HeadCell>
                  <Table.HeadCell>Status System</Table.HeadCell>
                  <Table.HeadCell>Status OBR</Table.HeadCell>
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
                  ) : rapportVente.length === 0 ? (
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
                     rapportVente.map((facture) => (
                        <Table.Row
                           className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                           key={facture.id + 'factures'}
                        >
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer  font-medium text-gray-900 dark:text-white"
                           >
                              {facture.numero_facture}
                           </Table.Cell>
                           <Table.Cell className="cursor-pointer  font-medium text-gray-900 dark:text-white">
                              {facture.date_paiement
                                 ? afficherDateHeure(facture.date_paiement)
                                 : ''}
                           </Table.Cell>
                           {client ? (
                              <></>
                           ) : (
                              <>
                                 <Table.Cell className="cursor-pointer  font-medium text-gray-900 dark:text-white">
                                    {facture.client.nom}
                                 </Table.Cell>

                                 <Table.Cell className="cursor-pointer  font-medium text-gray-900 dark:text-white">
                                    {facture.client.NIF}
                                 </Table.Cell>
                              </>
                           )}
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
                                 <span className="text-green-600">envoyer</span>
                              ) : (
                                 <span className="text-yellow-600">
                                    en attente
                                 </span>
                              )}
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
export default RapportVente
