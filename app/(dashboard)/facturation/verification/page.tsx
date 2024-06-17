'use client'

import { get_invoice_action } from '@/actions/ebms/invoice_check'
import {
   invoice_get_invoice_schema,
   invoice_items_schema,
} from '@/actions/ebms/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Label, Table, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
//import QRcode from 'react-qr-code'
import { useReactToPrint } from 'react-to-print'
import { z } from 'zod'
const verification_invoice_form_schema = z.object({
   invoice_identifiant: z
      .string()
      .trim()
      .min(1, 'La signature de la facture est obligatoire'),
})
export default function VerificationFacture() {
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
   const totalTVAFacture = (
      invoices_items: z.infer<typeof invoice_items_schema>[],
   ) => {
      let sum = 0
      for (const item of invoices_items) {
         sum = sum + Number(item.vat)
      }
      return sum
   }
   const totalHTVAFacture = (
      invoices_items: z.infer<typeof invoice_items_schema>[],
   ) => {
      let sum = 0
      for (const item of invoices_items) {
         sum = sum + Number(item.item_price_nvat)
      }
      return sum
   }
   const totalFacture = (
      invoices_items: z.infer<typeof invoice_items_schema>[],
   ) => {
      let sum = 0
      for (const item of invoices_items) {
         sum = sum + Number(item.item_total_amount)
      }
      return sum
   }
   type invoiceType = z.infer<typeof invoice_get_invoice_schema>
   const [invoice, setInvoice] = useState<invoiceType | undefined>(undefined)
   const [searchWord, setSearchWord] = useState<string | undefined>(undefined)
   const [errorMessage, setErrorMessage] = useState<string | undefined>(
      undefined,
   )
   const [loading, setLoading] = useState(false)
   const [isAsubmit, setIsASubmit] = useState(false)
   const componentRef = useRef<HTMLDivElement | null>(null)
   const [numero_facture_to_print, set_numero_facture_to_print] = useState<
      string | undefined
   >()
   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: numero_facture_to_print
         ? 'facture de verification numero ' + numero_facture_to_print
         : 'Facture de verification',
   })
   useEffect(() => {
      setInvoice(undefined)
      setErrorMessage(undefined)
      if (searchWord) {
         setLoading(true)
         get_invoice_action(searchWord)
            .then((data) => {
               setLoading(false)
               if (data.success) {
                  console.log(data.result.invoices[0])
                  setInvoice(data.result.invoices[0])
                  set_numero_facture_to_print(
                     data.result.invoices[0].invoice_number,
                  )
               } else {
                  setErrorMessage(data.msg)
               }
            })
            .catch(() => {
               setLoading(false)
               setErrorMessage("Une erreur s'est produit")
            })
      }
   }, [searchWord, isAsubmit])
   const form = useForm<z.infer<typeof verification_invoice_form_schema>>({
      resolver: zodResolver(verification_invoice_form_schema),
      defaultValues: { invoice_identifiant: '' },
   })
   const onSubmit = (
      values: z.infer<typeof verification_invoice_form_schema>,
   ) => {
      setSearchWord(values.invoice_identifiant)
      setIsASubmit(!isAsubmit)
   }
   return (
      <div>
         <form onSubmit={form.handleSubmit(onSubmit)} className="p-5">
            <Controller
               control={form.control}
               name="invoice_identifiant"
               render={({ field, fieldState: { invalid } }) => (
                  <div className="mb-2 block">
                     <Label
                        htmlFor="invoice_identifier"
                        value="Signature de la facture"
                     />
                     <TextInput
                        {...field}
                        id="invoice_identifier"
                        type="text"
                        color={invalid ? 'failure' : undefined}
                        autoComplete="off"
                        placeholder="Entrer la signature de la facture"
                        required
                     />
                  </div>
               )}
            />
            <div>
               <Button type="submit">Verifier</Button>
            </div>
         </form>
         {loading ? <div>Chargement de la facture...</div> : <></>}
         {errorMessage ? <Alert color="failure">{errorMessage}</Alert> : <></>}
         {invoice ? (
            <>
               <div className="p-5">
                  <div>
                     {' '}
                     Etat de la facture:
                     {invoice.cancelled_invoice === 'N' ? (
                        <>Facture valide</>
                     ) : (
                        <>Facture annulée</>
                     )}
                  </div>
                  {invoice.cn_motif ? (
                     <div>Motif: {invoice.cn_motif}</div>
                  ) : (
                     <></>
                  )}
                  <div>type facture: {invoice.invoice_type} </div>
                  {invoice.tp_type ? (
                     <div>
                        type vendeur:{' '}
                        {invoice.tp_type === '1'
                           ? 'personne physique'
                           : 'personne Morale'}
                     </div>
                  ) : (
                     <></>
                  )}
                  <div className="flex justify-center">
                     <Button onClick={handlePrint}>Imprimer</Button>
                  </div>
               </div>
               <div className=" flex w-full flex-col items-center justify-center gap-2    sm:gap-3">
                  <div
                     ref={componentRef}
                     className="max-w-vw flex flex-col gap-2 bg-white p-6 text-black dark:bg-dark dark:text-white"
                  >
                     <div className="flex justify-center font-bold">
                        Facture n°: {invoice.invoice_number}{' '}
                        {invoice.invoice_date ? (
                           <>du {invoice.invoice_date}</>
                        ) : (
                           <> </>
                        )}
                     </div>
                     <div>
                        <h2 className="font-bold">
                           A. Identification du vendeur
                        </h2>
                        <div className="flex gap-10">
                           <div>
                              <div>
                                 <div>{invoice.tp_name}</div>
                                 <div>NIF: {invoice.tp_TIN}</div>
                                 <div>RC: {}</div>
                                 <div>Téléphone: {invoice.tp_phone_number}</div>
                              </div>
                              <h3 className="font-medium">Adresse</h3>
                              <div className="flex gap-4">
                                 <div>
                                    <div>
                                       Province: {invoice.tp_adress_province}
                                    </div>
                                    <div>
                                       Commune: {invoice.tp_adress_commune}
                                    </div>
                                 </div>
                                 <div>
                                    <div>
                                       Quartier: {invoice.tp_adress_quartier}
                                    </div>
                                    {invoice.tp_adress_rue !== '-' ? (
                                       <div>
                                          Avenue: {invoice.tp_adress_rue}
                                       </div>
                                    ) : (
                                       <></>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div>
                              <div>
                                 Assujetit TVA:{' '}
                                 {invoice.vat_taxpayer === '1' ? (
                                    <>✔oui | non</>
                                 ) : (
                                    <>oui | ✔non</>
                                 )}
                              </div>
                              <div>
                                 Centre fiscal: {invoice.tp_fiscal_center}
                              </div>
                              <div>
                                 secteur d'activité:{' '}
                                 {invoice.tp_activity_sector}
                              </div>
                              <div>
                                 forme juridique: {invoice.tp_legal_form}
                              </div>
                           </div>
                        </div>
                        <h2 className="font-bold">
                           B. Identification du client
                        </h2>
                        <div className="flex gap-10">
                           <div>
                              <div>Nom: {invoice.customer_name}</div>
                              <div>NIF: {invoice.customent_TIN}</div>
                              <div>Adresse:{invoice.customer_adress}</div>
                           </div>
                           <div>
                              Assujetit TVA:{' '}
                              {invoice.customent_TIN ? (
                                 <>✔oui | non</>
                              ) : (
                                 <>oui | ✔non</>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="font-semibold">Doit ce qui suit:</div>
                     <div className="overflow-x-auto">
                        <Table className="border-collapse overflow-hidden border ">
                           <Table.Head>
                              <Table.HeadCell className="border border-black">
                                 Designation
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 Prix unitaire HTVA
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 Quantité
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 PV Total HTVA
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 TOTAL TVA
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 TOTAL TVAC
                              </Table.HeadCell>
                              <Table.HeadCell className="border border-black">
                                 TOTAL
                              </Table.HeadCell>
                           </Table.Head>
                           <Table.Body className="divide-y">
                              {invoice.invoice_items.length > 0 ? (
                                 <>
                                    {invoice.invoice_items.map(
                                       (element, index) => (
                                          <Table.Row
                                             className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                             key={index + 1}
                                          >
                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black font-medium text-gray-900 dark:text-white"
                                             >
                                                {element.item_designation}
                                             </Table.Cell>
                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black font-medium text-gray-900 dark:text-white"
                                             >
                                                {element.item_price}
                                             </Table.Cell>

                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black font-medium text-gray-900 dark:text-white"
                                             >
                                                {element.item_quantity}
                                             </Table.Cell>

                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black font-medium text-gray-900 dark:text-white"
                                             >
                                                {thousandSeparator(
                                                   element.item_price_nvat,
                                                )}
                                             </Table.Cell>
                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black  font-medium text-gray-900 dark:text-white"
                                             >
                                                {thousandSeparator(element.vat)}
                                             </Table.Cell>
                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black  font-medium text-gray-900 dark:text-white"
                                             >
                                                {thousandSeparator(
                                                   element.item_price_wvat,
                                                )}
                                             </Table.Cell>
                                             <Table.Cell
                                                aria-controls="facture"
                                                aria-expanded
                                                className="cursor-pointer border border-black  font-medium text-gray-900 dark:text-white"
                                             >
                                                {thousandSeparator(
                                                   element.item_total_amount,
                                                )}
                                             </Table.Cell>
                                          </Table.Row>
                                       ),
                                    )}
                                    <Table.Row className="border border border-black bg-white dark:border-gray-700 dark:bg-gray-800">
                                       <Table.Cell
                                          aria-controls="facture"
                                          aria-expanded
                                          colSpan={2}
                                          className="   bg-white font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          TOTAL hors TVA
                                       </Table.Cell>

                                       <Table.Cell
                                          colSpan={5}
                                          className="bg-white text-right font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          {thousandSeparator(
                                             totalHTVAFacture(
                                                invoice.invoice_items,
                                             ),
                                          )}
                                       </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="border border border-black bg-white dark:border-gray-700 dark:bg-gray-800">
                                       <Table.Cell
                                          aria-controls="facture"
                                          aria-expanded
                                          colSpan={2}
                                          className="  bg-white font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          TOTAL TVA
                                       </Table.Cell>

                                       <Table.Cell
                                          colSpan={5}
                                          className="bg-white text-right font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          {thousandSeparator(
                                             totalTVAFacture(
                                                invoice.invoice_items,
                                             ),
                                          )}
                                       </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="border border border-black bg-white dark:border-gray-700 dark:bg-gray-800">
                                       <Table.Cell
                                          aria-controls="facture"
                                          aria-expanded
                                          colSpan={2}
                                          className="border-b border-black  bg-white font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          TOTAL TVAC
                                       </Table.Cell>

                                       <Table.Cell
                                          colSpan={5}
                                          className="border-b border-black bg-white text-right font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                       >
                                          {thousandSeparator(
                                             totalFacture(
                                                invoice.invoice_items,
                                             ),
                                          )}
                                       </Table.Cell>
                                    </Table.Row>
                                 </>
                              ) : (
                                 <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                                    // key={facture.id + 'factures'}
                                 >
                                    <Table.Cell
                                       colSpan={6}
                                       // onClick={() => changefacture(facture)}
                                       className="cursor-pointer  text-center font-medium text-gray-900 dark:text-red-500"
                                    >
                                       Aucun article
                                    </Table.Cell>
                                 </Table.Row>
                              )}
                           </Table.Body>
                        </Table>
                     </div>

                     <div>Signature OBR: {invoice.invoice_identifier}</div>
                     {/* <div className="flex justify-center">
                        <QRcode
                           size={100}
                           value={invoice.invoice_identifier + ''}
                        />
                     </div> */}
                  </div>
               </div>
            </>
         ) : (
            <></>
         )}
      </div>
   )
}
