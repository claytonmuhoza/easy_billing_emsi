import * as z from 'zod'

export const LoginSchema = z.object({
   email: z
      .string()
      .refine(
         (s) => !s.includes(' '),
         "Le username ne peut pas contenir d'espace",
      ),
   password: z.string().trim().min(1, 'Veuillez saisir le mot de passe'),
})
export const NewUserSchema = z
   .object({
      name: z
         .string()
         .trim()
         .min(1, 'le nom est obligatoire')
         .min(2, 'le nom doit avoir au moins deux caractères'),
      // prenom: z
      //    .string()
      //    .trim()
      //    .min(1, 'le prénom est obligatoire')
      //    .min(2, 'le prénom doit avoir au moins deux caractères'),
      email: z
         .string()
         .refine(
            (s) => !s.includes(' '),
            "Le username ne peut pas contenir d'espace",
         ),
      // email: z.string().email({ message: 'entrer un email valide' }),
      password: z
         .string()
         .trim()
         .min(1, 'Veuillez saisir le mot de passe')
         .min(5, 'le mot de passe doit avoir au moins 5 caractères'),
      confirmPassword: z
         .string()
         .trim()
         .min(1, 'Veuillez saisir le mot de passe')
         .min(5, 'le mot de passe doit avoir au moins 5 caractères'),
      societe_id: z.preprocess(
         (a) => parseInt('' + z.string().parse(a + ''), 10),
         z.number(),
      ),
      //nom_prenom_signateur: z.string(),
   })
   .refine(
      (values) => {
         return values.password === values.confirmPassword
      },
      {
         message: 'Les mots de passe doivent correspondre!',
         path: ['confirmPassword'],
      },
   )
export const CategorieSchema = z.object({
   nom: z.string().trim().min(1, 'Le nom de la categorie est obligatoire'),
})
export const UniteMesureSchema = z.object({
   nom: z.string().trim().min(1, "Le nom de l'unité de mesure est obligatoire"),
})
export const banqueSchema = z.object({
   nom_banque: z
      .string()
      .trim()
      .min(1, 'Le nom de la banque est obligatoire')
      .min(2, 'Le nom de la banque doit avoir au moins 2 caractères'),
   numero_compte_banque: z
      .string()
      .trim()
      .min(1, 'Le numéro de compte est obligatoire'),
})

export const contribuableConfCreationSchema = z.object({
   nom: z
      .string()
      .trim()
      .min(1, { message: 'le nom est obligatoire' })
      .min(2, 'Le nom doit avoir au moins deux caractères'),
   nif: z
      .string()
      .trim()
      .min(1, { message: 'Le nif est obligatoire' })
      .min(4, 'Le nif doit avoir au moins 4 caractère'),
   rc: z
      .string({ required_error: 'le rc est obligatoire' })
      .trim()
      .min(1, 'Le rc est obligatoire'),
   identifiant_systeme: z
      .string()
      .trim()
      .min(1, "L'identifiat est obligatoire"),
   mot_de_passe_systeme: z
      .string()
      .trim()
      .min(1, 'Le mot de passe systeme est obligatoire'),
   type_contribuable: z.enum(['1', '2'], {
      required_error: 'le type de contribuable est obligatoire',
      invalid_type_error:
         'le contribuable est soit une personne physique, soit une personne morale',
   }),
   direction_fiscale: z.enum(['DPMC', 'DMC', 'DGC']),
   tva: z.boolean(),
   tc: z.boolean(),
   prelevement_forfetaire: z.boolean(),
   forme_juridique: z
      .string()
      .trim()
      .min(1, 'La forme juridique est obligatoire'),
   raison_social: z
      .string()
      .trim()
      .min(1, "La raison social de l'entreprise est obligatoire"),
   contact_telephone: z.string(),
   contact_bp: z.string(),
   contact_email: z.union([
      z.literal(''),
      z.string().email({
         message: 'Entrer un email valide',
      }),
   ]),
   adresse_province: z.string().trim().min(1, 'la province est obligatoire'),
   adresse_commune: z.string().trim().min(1, 'la commune est obligatoire'),
   adresse_quartier: z.string().trim().min(1, 'le quartier est obligatoire'),
   adresse_avenue: z.union([
      z.literal(''),
      z.string().trim().min(1, 'le quartier est obligatoire'),
   ]),
   adresse_numero: z.union([
      z.literal(''),
      z.string().min(1, 'le numero est obligatoire'),
   ]),
})
export const contribuable_update_schema = z.object({
   nom: z
      .string()
      .trim()
      .min(1, { message: 'le nom est obligatoire' })
      .min(2, 'Le nom doit avoir au moins deux caractères'),
   nif: z
      .string()
      .trim()
      .min(1, { message: 'Le nif est obligatoire' })
      .min(4, 'Le nif doit avoir au moins 4 caractère'),
   rc: z
      .string({ required_error: 'le rc est obligatoire' })
      .trim()
      .min(1, 'Le rc est obligatoire'),

   type_contribuable: z.enum(['1', '2'], {
      required_error: 'le type de contribuable est obligatoire',
      invalid_type_error:
         'le contribuable est soit une personne physique, soit une personne morale',
   }),
   direction_fiscale: z.enum(['DPMC', 'DMC', 'DGC']),
   tva: z.boolean(),
   tc: z.boolean(),
   prelevement_forfetaire: z.boolean(),
   forme_juridique: z
      .string()
      .trim()
      .min(1, 'La forme juridique est obligatoire'),
   raison_social: z
      .string()
      .trim()
      .min(1, "La raison social de l'entreprise est obligatoire"),
   contact_telephone: z.string(),
   contact_bp: z.string(),
   contact_email: z.union([
      z.literal(''),
      z.string().email({
         message: 'Entrer un email valide',
      }),
   ]),
   adresse_province: z.string().trim().min(1, 'la province est obligatoire'),
   adresse_commune: z.string().trim().min(1, 'la commune est obligatoire'),
   adresse_quartier: z.string().trim().min(1, 'le quartier est obligatoire'),
   adresse_avenue: z.union([
      z.literal(''),
      z.string().trim().min(1, 'le quartier est obligatoire'),
   ]),
   adresse_numero: z.union([
      z.literal(''),
      z.string().min(1, 'le numero est obligatoire'),
   ]),
})
const serviceSchema = z.object({
   nom: z
      .string()
      .trim()
      .min(1, 'Le nom du produit est obligatoire')
      .min(2, 'Le nom du produit doit avoir au moins deux caractères'),
   stockable: z.literal(false),
   prix_vente: z.preprocess(
      (a) => Number(a),
      z
         .number({
            required_error: 'le prix est obligatoire',
            invalid_type_error: 'vous devez entrer un nombre',
         })
         .nonnegative('le nombre doit être positif'),
   ),
   taux_tva: z.preprocess((a) => Number(a), z.number().nonnegative()),
   categorie_id: z.preprocess(
      (a) => parseInt('' + z.string().parse(a + ''), 10),
      z.number({
         invalid_type_error: 'veuillez selectionner une categorie',
         required_error: 'la quategorie est obligatoire',
      }),
   ),
   unite_mesure_id: z.preprocess(
      (a) => parseInt('' + z.string().parse(a + ''), 10),
      z.number({
         invalid_type_error: 'veuillez selectionner une categorie',
         required_error: 'la categorie est obligatoire',
      }),
   ),
})

const produitShema = z.object({
   nom: z
      .string()
      .trim()
      .min(1, 'Le nom du produit est obligatoire')
      .min(2, 'Le nom du produit doit avoir au moins deux caractères'),
   stockable: z.literal(true),
   prix_revient: z.preprocess(
      (a) => Number(a),
      z.number().nonnegative('Le prix ne peut pas être negatif'),
   ),
   stock_minimal_alert: z.preprocess(
      (a) => Number(a),
      z
         .number({
            required_error: 'la quantite de stock minimal est  obligatoire',
         })
         .nonnegative('la quantite de stock minimal doit être positif'),
   ),
   prix_vente: z.preprocess(
      (a) => Number(a),
      z
         .number({
            required_error: 'le prix est obligatoire',
            invalid_type_error: 'vous devez entrer un nombre',
         })
         .nonnegative('le nombre doit être positif'),
   ),
   taux_tva: z.preprocess((a) => Number(a), z.number().nonnegative()),
   categorie_id: z.preprocess(
      (a) => parseInt('' + z.string().parse(a + ''), 10),
      z.number({
         invalid_type_error: 'veuillez selectionner une categorie',
         required_error: 'la quategorie est obligatoire',
      }),
   ),
   unite_mesure_id: z.preprocess(
      (a) => parseInt('' + z.string().parse(a + ''), 10),
      z.number({
         invalid_type_error: 'veuillez selectionner une categorie',
         required_error: 'la categorie est obligatoire',
      }),
   ),
})
export const ArticleSchema = z.discriminatedUnion('stockable', [
   serviceSchema,
   produitShema,
])
export const ClientShema = z
   .object({
      nom_entreprise_client: z
         .string()
         .trim()
         .min(1, 'Le nom est obligatoire')
         .min(2, 'Le nom du client doit avoir au moins deux caractère'),
      nif_entreprise_client: z.string(),
      secteur_activite_client: z.string(),
      localisation_client: z.enum(['local', 'etranger']),
      type_client: z.enum(['morale', 'physique'], {
         required_error: 'Le type de client est obligatoire',
         invalid_type_error: 'Le client doit  être soit locale ou etranger',
      }),
      assujetti_tva_client: z.boolean(),
      numero_telephone_client: z.string(),
      boite_postal_client: z.string(),
      adresse_mail_client: z.union([z.literal(''), z.string().email()]),
      adresse_client: z.string(),
      personne_contact_client: z.string(),
      contact_personne_contact_client: z.string(),
   })
   .superRefine(
      (
         { type_client, localisation_client, nif_entreprise_client },
         refinementContext,
      ) => {
         if (type_client === 'physique') {
            if (localisation_client === 'local') {
               return true
            } else {
               if (nif_entreprise_client === '') {
                  return true
               } else {
                  return refinementContext.addIssue({
                     code: z.ZodIssueCode.custom,
                     message: 'Le nif doit être vide pour un client etranger',
                     path: ['nif_entreprise_client'],
                  })
               }
            }
         } else {
            if (
               type_client === 'morale' &&
               localisation_client === 'etranger'
            ) {
               if (nif_entreprise_client === '') {
                  return true
               } else {
                  return refinementContext.addIssue({
                     code: z.ZodIssueCode.custom,
                     message: 'Le nif doit être vide pour un client etranger',
                     path: ['nif_entreprise_client'],
                  })
               }
            } else {
               if (
                  type_client === 'morale' &&
                  localisation_client === 'local' &&
                  nif_entreprise_client.length >= 1
               ) {
                  return true
               } else {
                  return refinementContext.addIssue({
                     code: z.ZodIssueCode.custom,
                     message:
                        'Le NIF est obligatoire pour un client morale local',
                     path: ['nif_entreprise_client'],
                  })
               }
            }
         }
      },
   )
export const factureSchema = z.object({
   facture_devise: z.string().min(1, 'La devise de la facture est obligatoire'),
   facture_client: z.number(),
})
export const detailFacture = z.object({
   facture_article: z.number(),
   facture_article_prix_unitaire_hors_tva: z.number(),
   facture_article_taux_tva: z.number(),
   facture_article_quantite: z.number(),
})
export const entree_stock_schema = z.object({
   produit_id: z.number(),
   type_mouvement: z.enum(['EN', 'EAJ', 'ET', 'EAU']),
   prix_achat: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z.number({
         invalid_type_error: 'Vous devez entrer un nombre',
         required_error: "le prix d'achat est obligatoire",
      }),
   ),
   quantite: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z
         .number({
            invalid_type_error: 'Vous devez entrer un nombre',
            required_error: 'la quantité est obligatoire',
         })
         .gt(0, 'La quantité doit être supérieur à 0'),
   ),
   motif: z.union([z.literal(''), z.string()]),
})
export const sortie_stock_schema = z.object({
   produit_id: z.number(),
   type_mouvement: z.enum(['SN', 'SP', 'SV', 'SD', 'SC', 'SAJ', 'ST', 'SAU']),
   prix_achat: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z.number({
         invalid_type_error: 'Vous devez entrer un nombre',
         required_error: "le prix d'achat est obligatoire",
      }),
   ),
   quantite: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z
         .number({
            invalid_type_error: 'Vous devez entrer un nombre',
            required_error: 'la quantité est obligatoire',
         })
         .gt(0, 'La quantité doit être supérieur à 0'),
   ),
   motif: z.union([z.literal(''), z.string()]),
})
export const inventaire_stock_schema = z.object({
   produit_id: z.number(),
   prix_achat: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z.number({
         invalid_type_error: 'Vous devez entrer un nombre',
         required_error: "le prix d'achat est obligatoire",
      }),
   ),
   quantite: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z
         .number({
            invalid_type_error: 'Vous devez entrer un nombre',
            required_error: 'la quantité est obligatoire',
         })
         .gt(0, 'La quantité doit être supérieur à 0'),
   ),
   motif: z.union([z.literal(''), z.string()]),
})
const etape_1_facture_form_bif = z.object({
   client_id: z.number(),
   devise: z.literal('BIF'),
   type_paiement: z.enum(['1', '2', '3', '4']),
   caution: z
      .preprocess(
         (a) => parseFloat('' + z.string().parse(a + '')),
         z
            .number({
               invalid_type_error: 'Vous devez entrer un nombre',
               required_error: 'le taux de change est obligatoire',
            })
            .gt(0, 'Le taux de change doit être supérieur à 0'),
      )
      .optional(),
   banque_id: z
      .preprocess(
         (a) => parseInt('' + z.string().parse(a + '')),
         z
            .number({
               invalid_type_error: 'Veuillez selectionner une banque',
               required_error: 'Veuillez selectionner une banque',
            })
            .gt(0, 'Veuillez selectionner une banque'),
      )
      .optional(),
   description_type_paiement: z
      .string()
      .trim()
      .min(1, 'le type de paiement est obligatoire')
      .optional(),
})
const etape_1_facture_form_devise = z.object({
   client_id: z.number(),
   devise: z.enum(['USD', 'EUR']),
   type_paiement: z.enum(['1', '2', '3', '4']),
   caution: z
      .preprocess(
         (a) => parseFloat('' + z.string().parse(a + '')),
         z
            .number({
               invalid_type_error: 'Vous devez entrer un nombre',
               required_error: 'le taux de change est obligatoire',
            })
            .gt(0, 'Le taux de change doit être supérieur à 0'),
      )
      .optional(),
   // taux_de_change: z.preprocess(
   //    (a) => parseFloat('' + z.string().parse(a + '')),
   //    z
   //       .number({
   //          invalid_type_error: 'Vous devez entrer un nombre',
   //          required_error: 'le taux de change est obligatoire',
   //       })
   //       .gt(0, 'Le taux de change doit être supérieur à 0'),
   // ),
   banque_id: z
      .preprocess(
         (a) => parseInt('' + z.string().parse(a + '')),
         z
            .number({
               invalid_type_error: 'Veuillez selectionner une banque',
               required_error: 'Veuillez selectionner une banque',
            })
            .gt(0, 'Veuillez selectionner une banque'),
      )
      .optional(),
   description_type_paiement: z
      .string()
      .trim()
      .min(1, 'le type de paiement est obligatoire')
      .optional(),
})

export const etape_1_facture_form_schema = z
   .discriminatedUnion('devise', [
      etape_1_facture_form_devise,
      etape_1_facture_form_bif,
   ])
   .superRefine(({ type_paiement, banque_id }, refinementContext) => {
      if (type_paiement !== '2') {
         return true
      } else {
         if (type_paiement === '2' && banque_id) {
            return true
         } else {
            return refinementContext.addIssue({
               code: z.ZodIssueCode.custom,
               message: 'La banque est obligatoire',
               path: ['banque_id'],
            })
         }
      }
   })
export const detail_facture_form_schema = z.object({
   facture_id: z.number(),
   produit_id: z.number(),
   stockable: z.boolean(),
   stock_actuel: z.number(),
   prix_vente_ttc: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z
         .number({
            invalid_type_error: 'Entrer le prix de vente',
            required_error: 'Entrer le prix de vente',
         })
         .gt(0, 'Le prix de vente doit être superieur à 0'),
   ),
   quantite: z.preprocess(
      (a) => parseFloat('' + z.string().parse(a + '')),
      z
         .number({
            invalid_type_error: 'Entrer une quantité valide',
            required_error: 'Entrer la quantité',
         })
         .gt(0, 'La quantité doit être superieur à 0'),
   ),
})

export const invoice_item = z.object({
   item_designation: z.string(),
   item_price: z.number(),
   item_quantity: z.number(),
   item_ct: z.number(),
   item_tl: z.number(),
   item_ott_tax: z.number(),
   item_tsce_tax: z.number(),
   item_price_nvat: z.number(),
   vat: z.number(),
   item_price_wvat: z.number(),
   item_total_amount: z.number(),
})
export const format_facture_obr_schema = z.object({
   invoice_number: z.string(),
   invoice_date: z.string(),
   invoice_type: z.string(),
   // 1 or 2
   tp_type: z.string(),
   tp_name: z.string(),
   tp_TIN: z.string(),
   tp_trade_number: z.string(),
   tp_postal_number: z.string(),
   tp_address_province: z.string(),
   tp_address_commune: z.string(),
   tp_address_quartier: z.string(),
   tp_address_avenue: z.string(),
   tp_address_number: z.string(),
   vat_taxpayer: z.enum(['0', '1']),
   ct_taxpayer: z.enum(['0', '1']),
   tl_taxpayer: z.enum(['0', '1']),
   tp_fiscal_center: z.string(),
   tp_activity_sector: z.string(),
   tp_legal_form: z.string(),
   payment_type: z.string(),
   invoice_currency: z.string(),
   customer_name: z.string(),
   customer_TIN: z.string(),
   customer_adress: z.string(),
   vat_customer_payer: z.enum(['0', '1']),
   cancelled_invoice_ref: z.string(),
   cancelled_invoice: z.enum(['N', 'Y']),
   invoice_ref: z.string(),
   cn_motif: z.string(),
   invoice_identifier: z.string(),
   invoice_items: z.array(invoice_item),
})
export const annulation_facture_schema = z.object({
   motif: z.string().trim().min(1, "motif d'annulation est obligatoire"),
})
export const rapport_stock_filter_schema = z.object({
   date_debut: z.string().optional(),
   date_fin: z.string().optional(),
})
export const rapport_vente_filter_schema = z.object({
   date_debut: z.string().optional(),
   date_fin: z.string().optional(),
   type_facture: z.enum(['tous', 'valide', 'annuler']),
})
export const banque_schema = z.object({
   nom_banque: z.string().trim().min(1, 'Le nom de la banque est obligatoire'),
   numero_compte: z
      .string()
      .trim()
      .min(1, 'Le numéro de compte est obligatoire'),
})
export const change_password_schema = z
   .object({
      ex_password: z.string().trim().min(1, 'le mot de passe est obligatoire'),
      // prenom: z
      //    .string()
      //    .trim()
      //    .min(1, 'le prénom est obligatoire')
      //    .min(2, 'le prénom doit avoir au moins deux caractères'),

      // email: z.string().email({ message: 'entrer un email valide' }),
      password: z
         .string()
         .trim()
         .min(1, 'Veuillez saisir le mot de passe')
         .min(5, 'le mot de passe doit avoir au moins 5 caractères'),
      confirmPassword: z
         .string()
         .trim()
         .min(1, 'Veuillez saisir le mot de passe')
         .min(5, 'le mot de passe doit avoir au moins 5 caractères'),
      //nom_prenom_signateur: z.string(),
   })
   .refine(
      (values) => {
         return values.password === values.confirmPassword
      },
      {
         message: 'Les mots de passe doivent correspondre!',
         path: ['confirmPassword'],
      },
   )
