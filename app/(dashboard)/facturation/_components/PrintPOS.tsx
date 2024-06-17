import { Prisma } from '@prisma/client'
import { Spinner, Table } from 'flowbite-react'
import { tout_taxe_comprise_prix } from '../../_components/util_javascript'
const fIncludes = Prisma.validator<Prisma.FactureDefaultArgs>()({
   include: {
      details_facture: true,
      client: true,
      societe: true,
      banque: true,
   },
})
type Facture = Prisma.FactureGetPayload<typeof fIncludes>
const detailsIncludes = Prisma.validator<Prisma.DetailFactureDefaultArgs>()({
   include: {
      facture: true,
      produit: true,
   },
})
type DetailsFacture = Prisma.DetailFactureGetPayload<typeof detailsIncludes>
export default function POSPrint({
   facture,
   returnZeroWhereLessThanTen,
   loading_detail,
   totalTVAFacture,
   totalFacture,
   thousandSeparator,
   detailsFacture,
   arrondir_fbu,
   afficherFloat,
}: {
   loading_detail: boolean
   totalTVAFacture: (detail: DetailsFacture[]) => number
   totalFacture: (detail: DetailsFacture[]) => number
   thousandSeparator: (number: number, symbol?: string) => string
   detailsFacture: DetailsFacture[]
   returnZeroWhereLessThanTen: (date: number) => string
   facture: Facture
   arrondir_fbu: (montant: number) => number
   afficherFloat: (montant: number) => string
}) {
   return (
      <div className="m-0 flex w-full flex-col gap-2 p-0 text-xs text-black dark:text-white">
         <div className="flex justify-center font-bold">
            Facture n° : {facture.numero_facture}{' '}
            {facture.date_paiement ? (
               <>
                  du{' '}
                  {returnZeroWhereLessThanTen(facture.date_paiement.getDate()) +
                     facture.date_paiement.getDate() +
                     '/' +
                     returnZeroWhereLessThanTen(
                        facture.date_paiement.getMonth() + 1,
                     ) +
                     (facture.date_paiement.getMonth() + 1) +
                     '/' +
                     facture.date_paiement.getFullYear()}
               </>
            ) : (
               <> </>
            )}
         </div>
         <div>
            <h2 className="font-bold">A. Identification du vendeur</h2>
            <div className="flex gap-10">
               <div>
                  <div>
                     <div>{facture.societe.nom}</div>
                     <div>NIF : {facture.societe.nif}</div>
                     <div>RC : {facture.societe.rc}</div>
                     <div>Téléphone : {facture.societe.telephone}</div>
                  </div>
                  <h3 className="font-medium">Adresse</h3>
                  <div className="flex gap-4">
                     <div>
                        <div>Province: {facture.societe.adresse_province}</div>
                        <div>Commune: {facture.societe.adresse_commune}</div>
                     </div>
                     <div>
                        <div>Quartier: {facture.societe.adresse_quartier}</div>
                        {facture.societe.adresse_avenue !== '-' ? (
                           <div>Avenue: {facture.societe.adresse_avenue}</div>
                        ) : (
                           <></>
                        )}
                     </div>
                  </div>
               </div>
               <div>
                  <div>
                     Assujetit à la TVA:{' '}
                     {facture.societe.tva ? <> Oui</> : <> Non</>}
                  </div>
                  <div>Centre fiscal: {facture.societe.direction_fiscale}</div>
                  <div>
                     secteur d'activité: {facture.societe.secteur_activite}
                  </div>
                  <div>forme juridique: {facture.societe.forme_juridique}</div>
               </div>
            </div>
            <h2 className="font-bold">B. Identification du client</h2>
            <div className="flex gap-10">
               <div className="max-w-100">
                  <div>Nom: {facture.client.nom}</div>
                  <div>NIF: {facture.client.NIF}</div>
                  <div>Adresse: {facture.client.adresse}</div>
               </div>
               <div>
                  Assujetit à la TVA:{' '}
                  {facture.client.assujetti_tva ? <>Oui</> : <>Non</>}
               </div>
            </div>
         </div>
         <div className="font-semibold">Doit ce qui suit :</div>
         <div>
            <Table className="border-collapse overflow-hidden border ">
               <Table.Head className="bg-white font-bold text-black">
                  <Table.HeadCell className="break-words border border-black bg-white p-0 font-bold">
                     <span>Designation</span>
                  </Table.HeadCell>
                  <Table.HeadCell className=" max-w-10 break-words border border-black bg-white p-0">
                     <span>
                        {tout_taxe_comprise_prix
                           ? 'PU'
                           : !facture.societe.tva
                             ? 'PU'
                             : 'PU HTVA'}
                     </span>
                  </Table.HeadCell>

                  <Table.HeadCell className="max-w-4 break-words border border-black bg-white p-0 font-bold">
                     <span>Q</span>
                  </Table.HeadCell>
                  {facture.societe.tva ||
                  totalTVAFacture(detailsFacture) !== 0 ? (
                     <>
                        <Table.HeadCell className="break-words border border-black bg-white p-0">
                           <span>TOTAL TVA</span>
                        </Table.HeadCell>
                     </>
                  ) : (
                     <></>
                  )}
                  <Table.HeadCell className="break-words border border-black bg-white p-0">
                     <span>TOTAL</span>
                  </Table.HeadCell>
               </Table.Head>
               <Table.Body className="divide-y">
                  {loading_detail ? (
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
                  ) : detailsFacture.length > 0 ? (
                     detailsFacture.map((element) => (
                        <Table.Row
                           className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                           key={element.id}
                        >
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer break-words border border-black p-0 font-medium text-gray-900 dark:text-white"
                           >
                              {element.produit.nom}
                           </Table.Cell>
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer break-words border border-black p-0 font-medium text-gray-900 dark:text-white"
                           >
                              {tout_taxe_comprise_prix
                                 ? thousandSeparator(
                                      element.prix_vente_unitaire,
                                      '.',
                                   )
                                 : thousandSeparator(
                                      element.prix_unitaire_vente_hors_tva,
                                      '.',
                                   )}
                           </Table.Cell>

                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer break-words border border-black p-0 font-medium text-gray-900 dark:text-white"
                           >
                              {element.quantite}
                           </Table.Cell>
                           {facture.societe.tva ||
                           element.prix_unitaire_tva !== 0 ? (
                              <>
                                 <Table.Cell
                                    aria-controls="facture"
                                    aria-expanded
                                    className="cursor-pointer border border-black p-0  font-medium text-gray-900 dark:text-white"
                                 >
                                    {thousandSeparator(
                                       arrondir_fbu(
                                          Number(
                                             afficherFloat(
                                                element.prix_unitaire_tva *
                                                   element.quantite,
                                             ),
                                          ),
                                       ),
                                       '.',
                                    )}
                                 </Table.Cell>
                              </>
                           ) : (
                              <></>
                           )}
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              className="cursor-pointer border border-black p-0  font-medium text-gray-900 dark:text-white"
                           >
                              {thousandSeparator(
                                 arrondir_fbu(
                                    (element.prix_unitaire_vente_hors_tva +
                                       element.prix_unitaire_tva) *
                                       element.quantite,
                                 ),
                                 '.',
                              )}
                           </Table.Cell>
                        </Table.Row>
                     ))
                  ) : (
                     <Table.Row
                        className="bg-white p-0 dark:border-gray-700 dark:bg-gray-800 "
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

                  {!facture && (
                     <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                        // key={facture.id + 'factures'}
                     >
                        <Table.Cell
                           colSpan={6}
                           // onClick={() => changefacture(facture)}
                           className="cursor-pointer p-0 text-center font-medium text-gray-900 dark:text-red-500"
                        >
                           {'No Data to Display'}
                        </Table.Cell>
                     </Table.Row>
                  )}
                  {facture && (
                     <>
                        {facture.societe.tva ||
                        totalTVAFacture(detailsFacture) !== 0 ? (
                           <>
                              <Table.Row className="border border border-black bg-white dark:border-gray-700 dark:bg-gray-800">
                                 <Table.Cell
                                    aria-controls="facture"
                                    aria-expanded
                                    colSpan={2}
                                    className="bg-white  p-0 font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                 >
                                    Total HTVA
                                 </Table.Cell>

                                 <Table.Cell
                                    colSpan={3}
                                    className="bg-white p-0 text-right font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                 >
                                    {loading_detail
                                       ? 'calcul en cours...'
                                       : thousandSeparator(
                                            Number(
                                               afficherFloat(
                                                  totalFacture(detailsFacture) -
                                                     totalTVAFacture(
                                                        detailsFacture,
                                                     ),
                                               ),
                                            ),
                                            '.',
                                         ) +
                                         ' ' +
                                         facture.devise}
                                 </Table.Cell>
                              </Table.Row>
                              <Table.Row className="border border border-black bg-white dark:border-gray-700 dark:bg-gray-800">
                                 <Table.Cell
                                    aria-controls="facture"
                                    aria-expanded
                                    colSpan={2}
                                    className="bg-white  p-0 font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                 >
                                    Total TVA
                                 </Table.Cell>

                                 <Table.Cell
                                    colSpan={3}
                                    className="bg-white p-0 text-right font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                 >
                                    {loading_detail
                                       ? 'calcul en cours...'
                                       : thousandSeparator(
                                            Number(
                                               afficherFloat(
                                                  totalTVAFacture(
                                                     detailsFacture,
                                                  ),
                                               ),
                                            ),
                                            '.',
                                         ) +
                                         ' ' +
                                         facture.devise}
                                 </Table.Cell>
                              </Table.Row>
                           </>
                        ) : (
                           <></>
                        )}
                        <Table.Row className="border border-black bg-white font-bold dark:border-gray-700 dark:bg-gray-800">
                           <Table.Cell
                              aria-controls="facture"
                              aria-expanded
                              colSpan={2}
                              className="text-black-200 text-gray-90 border-b border-black border-black bg-white  p-0 font-bold font-bold font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                           >
                              PT TVAC
                           </Table.Cell>

                           <Table.Cell
                              colSpan={3}
                              className="text-black-200 border-b border-black bg-white p-0 text-right font-bold font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                           >
                              {loading_detail
                                 ? 'calcul en cours...'
                                 : thousandSeparator(
                                      totalFacture(detailsFacture),
                                      '.',
                                   ) +
                                   ' ' +
                                   facture.devise}
                           </Table.Cell>
                        </Table.Row>
                     </>
                  )}
               </Table.Body>
            </Table>
         </div>
         {/* {facture.banque ? (
                     <span>
                        Le montant est à verser au compte{' '}
                        <span className="font-bold">
                           {facture.banque.numero_compte}
                        </span>{' '}
                        ouvert dans la banque{' '}
                        <span className="font-bold">
                           {facture.banque.nom_bank}
                        </span>{' '}
                     </span>
                  ) : (
                     <></>
                  )} */}
         <div className="text-black">
            ID OBR : {facture.numero_unique_facture}
         </div>
         <div className="mt-3 font-bold text-black">
            Les marchandises vendues ne sont ni échangées ni reprises
         </div>
         {/* <div className="flex justify-center">
                     <QRcode
                        size={100}
                        value={facture.numero_unique_facture + ''}
                     />
                  </div> */}
      </div>
   )
}
