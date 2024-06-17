'use client'
import { useFacturationContext } from '@/context/FacturationContext'
import { Prisma } from '@prisma/client'
import {
   BorderStyle,
   Document,
   Packer,
   Paragraph,
   Table,
   TableCell,
   TableRow,
   TextRun,
} from 'docx'
import { saveAs } from 'file-saver'
import { Button } from 'flowbite-react'
import { arrondir_fbu } from '../../_components/util_javascript'
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
const returnZeroWhereLessThanTen = (number: number) => {
   if (number < 10) {
      return '0'
   } else {
      return ''
   }
}
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
const totalFacture = (details: DetailsFacture[]) => {
   let somme = 0
   if (details.length > 0) {
      for (const detail of details) {
         somme += arrondir_fbu(
            (detail.prix_unitaire_tva + detail.prix_unitaire_vente_hors_tva) *
               detail.quantite,
         )
      }
   }
   return somme
}
const totalTVAFacture = (details: DetailsFacture[]) => {
   let somme = 0
   if (details.length > 0) {
      for (const detail of details) {
         somme += arrondir_fbu(detail.prix_unitaire_tva * detail.quantite)
      }
   }
   return somme
}
const facturedocument = async (
   facture: Facture,
   detailsFacture: DetailsFacture[],
) => {
   const returnDetailFacture = () => {
      const tables = []
      tables.push(
         new TableRow({
            children: [
               new TableCell({ children: [new Paragraph('Dénomination')] }),
               new TableCell({ children: [new Paragraph('PUHTVA')] }),
               new TableCell({ children: [new Paragraph('Quantité')] }),
               new TableCell({ children: [new Paragraph('PVTHTVA')] }),
               new TableCell({ children: [new Paragraph('Total TVA')] }),
               new TableCell({ children: [new Paragraph('Total TVAC')] }),
            ],
         }),
      )
      for (const element of detailsFacture) {
         tables.push(
            new TableRow({
               children: [
                  new TableCell({
                     children: [new Paragraph(element.produit.nom + '')],
                  }),
                  new TableCell({
                     children: [
                        new Paragraph(
                           thousandSeparator(
                              element.prix_unitaire_vente_hors_tva,
                              ' ',
                           ),
                        ),
                     ],
                  }),
                  new TableCell({
                     children: [new Paragraph(element.quantite + '')],
                  }),
                  new TableCell({
                     children: [
                        new Paragraph(
                           thousandSeparator(
                              arrondir_fbu(
                                 Number(
                                    element.prix_unitaire_vente_hors_tva *
                                       element.quantite,
                                 ),
                              ),
                              ' ',
                           ),
                        ),
                     ],
                  }),
                  new TableCell({
                     children: [
                        new Paragraph(
                           thousandSeparator(
                              arrondir_fbu(
                                 Number(
                                    element.prix_unitaire_tva *
                                       element.quantite,
                                 ),
                              ),
                              ' ',
                           ),
                        ),
                     ],
                  }),
                  new TableCell({
                     children: [
                        new Paragraph(
                           thousandSeparator(
                              arrondir_fbu(
                                 (element.prix_unitaire_vente_hors_tva +
                                    element.prix_unitaire_tva) *
                                    element.quantite,
                              ),
                              ' ',
                           ),
                        ),
                     ],
                  }),
               ],
            }),
         )
      }
      tables.push(
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('Total HTVA')],
               }),
               new TableCell({
                  children: [
                     new Paragraph({
                        text:
                           thousandSeparator(
                              Number(
                                 totalFacture(detailsFacture) -
                                    totalTVAFacture(detailsFacture),
                              ),
                              ' ',
                           ) +
                           ' ' +
                           facture.devise,
                        alignment: 'right',
                     }),
                  ],
                  columnSpan: 5,
               }),
            ],
         }),
      )
      tables.push(
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('TVA')],
               }),
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text:
                                 thousandSeparator(
                                    Number(totalTVAFacture(detailsFacture)),
                                    ' ',
                                 ) +
                                 ' ' +
                                 facture.devise,
                           }),
                        ],

                        alignment: 'right',
                     }),
                  ],
                  columnSpan: 5,
               }),
            ],
         }),
      )
      tables.push(
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('Total TVAC')],
               }),
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text:
                                 thousandSeparator(
                                    totalFacture(detailsFacture),
                                    ' ',
                                 ) +
                                 ' ' +
                                 facture.devise,
                              bold: true,
                           }),
                        ],
                        alignment: 'right',
                     }),
                  ],
                  columnSpan: 5,
               }),
            ],
         }),
      )
      return tables
   }
   const tableFacture = new Table({
      rows: returnDetailFacture(),

      width: { size: '100%', type: 'auto' },
   })
   const tableIdentificationVendeur = new Table({
      rows: [
         new TableRow({
            children: [
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({ text: 'Nom: ' }),
                           new TextRun({ text: facture.societe.nom }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text: 'Assujetti à la TVA: ',
                           }),
                           new TextRun({
                              text: facture.societe.tva ? 'Oui' : 'Non',
                           }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('NIF : ' + facture.societe.nif)],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph(
                        'Centre fiscal: ' + facture.societe.direction_fiscale,
                     ),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('RC : ' + facture.societe.rc)],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph(
                        "secteur d'activité: " +
                           facture.societe.secteur_activite,
                     ),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [
                     new Paragraph('téléphone : ' + facture.societe.telephone),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph(
                        'Centre fiscal: ' + facture.societe.forme_juridique,
                     ),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('Adresse')],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [new Paragraph('')],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text:
                                 'Province: ' +
                                 facture.societe.adresse_province,
                           }),
                           new TextRun({
                              text:
                                 '\tCommune: ' +
                                 facture.societe.adresse_commune,
                           }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [new Paragraph('')],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text:
                                 'Quartier: ' +
                                 facture.societe.adresse_quartier,
                           }),
                           new TextRun({
                              text:
                                 '\tAvenue: ' + facture.societe.adresse_avenue,
                           }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               facture.societe.adresse_avenue !== '-'
                  ? new TableCell({
                       children: [new Paragraph('')],
                       borders: {
                          top: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          bottom: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          left: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          right: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                       },
                    })
                  : new TableCell({
                       children: [],
                       borders: {
                          top: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          bottom: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          left: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                          right: {
                             style: BorderStyle.NONE,
                             size: 0,
                             color: 'FFFFFF',
                          },
                       },
                    }),
            ],
         }),
      ],
      width: { size: '100%', type: 'auto' },
   })
   const tableIdentificationClient = new Table({
      rows: [
         new TableRow({
            children: [
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({ text: 'Nom du client: ' }),
                           new TextRun({ text: facture.client.nom }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph({
                        children: [
                           new TextRun({
                              text: 'Assujetti à la TVA: ',
                           }),
                           new TextRun({
                              text: facture.client.assujetti_tva
                                 ? 'Oui'
                                 : 'Non',
                           }),
                        ],
                     }),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
         new TableRow({
            children: [
               new TableCell({
                  children: [new Paragraph('NIF : ' + facture.client.NIF)],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
               new TableCell({
                  children: [
                     new Paragraph('Adresse: ' + facture.client.adresse),
                  ],
                  borders: {
                     top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                     bottom: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     left: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                     right: {
                        style: BorderStyle.NONE,
                        size: 0,
                        color: 'FFFFFF',
                     },
                  },
               }),
            ],
         }),
      ],
      width: { size: '100%', type: 'auto' },
      borders: {
         top: { style: 'none' },
         bottom: { style: 'none' },
         left: { style: 'none' },
         right: { style: 'none' },
      },
   })
   const document = new Document({
      sections: [
         {
            properties: {},
            children: [
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Facture n° : ' + facture.numero_facture,
                        bold: true,
                     }),
                     new TextRun({
                        text: ' du ',
                        bold: true,
                     }),
                     new TextRun({
                        text: facture.date_paiement
                           ? returnZeroWhereLessThanTen(
                                facture.date_paiement.getDate(),
                             ) +
                             facture.date_paiement.getDate() +
                             '/' +
                             returnZeroWhereLessThanTen(
                                facture.date_paiement.getMonth() + 1,
                             ) +
                             (facture.date_paiement.getMonth() + 1) +
                             '/' +
                             facture.date_paiement.getFullYear()
                           : '',
                        bold: true,
                     }),
                  ],
                  alignment: 'center',
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'A. Identification du vendeur',
                        bold: true,
                     }),
                  ],
               }),
               tableIdentificationVendeur,
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'B. Identification du client',
                        bold: true,
                     }),
                  ],
               }),
               tableIdentificationClient,
               new Paragraph({
                  children: [
                     new TextRun({
                        text: '',
                     }),
                  ],
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Doit ce qui suit :',
                        bold: true,
                     }),
                  ],
               }),

               tableFacture,
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Signature OBR : ',
                     }),
                     new TextRun({
                        text: facture.numero_unique_facture
                           ? facture.numero_unique_facture
                           : '',
                     }),
                  ],
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: '',
                     }),
                  ],
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Les marchandises vendues ne sont ni échangées ni reprises',
                        bold: true,
                     }),
                  ],
               }),
            ],
         },
      ],
   })

   const blob = await Packer.toBlob(document)
   const nom_file =
      'facture numero' + facture.numero_facture
         ? facture.numero_facture?.replaceAll('/', '_')
         : ''
   saveAs(blob, 'Facture numero ' + nom_file)
}
export default function EnregistrerDocx({
   detailsFacture,
}: {
   detailsFacture: DetailsFacture[]
}) {
   const { facture } = useFacturationContext()
   return (
      <>
         <Button
            className="mt-5 "
            onClick={() =>
               facture
                  ? facturedocument(facture, detailsFacture)
                  : alert("la facture n'a pas pu etre recuperer")
            }
         >
            Enregistrer document
         </Button>
      </>
   )
}
