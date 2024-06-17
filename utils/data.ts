import { Societe } from '@prisma/client'
// import Deci

export const societe: Societe[] = [
   {
      id: 1, // Auto-generated ID
      identifiant_system: 'ACME_1234', // Unique system identifier
      mot_de_passe_system: 'hashed_password', // Hashed system password (for security)
      type_societe: '1',
      nom: 'ACME Corporation',
      nif: '123456789', // Tax identification number
      rc: 'CD/GOMA/00001234', // Optional commercial register number
      email: 'info@acmecorp.com',
      telephone: '+243 81 234 5678',
      bp: 'BP 1234', // Optional postal box
      forme_juridique: 'Société à Responsabilité Limitée (SARL)', // Legal form
      secteur_activite: 'Fabrication',
      adresse_province: 'Nord-Kivu',
      adresse_commune: 'Goma',
      adresse_quartier: 'Les Volcans',
      adresse_avenue: 'Avenue de la Paix',
      adresse_numero: '123', // Optional street number
      tva: true, // Subject to VAT
      taux_tva: null, // VAT rate (decimal)
      tc: false, // Subject to business tax
      prelevement_forfetaire: false, // Subject to flat-rate tax
      direction_fiscale: 'Goma', // Location of tax office
      createAt: new Date(), // Auto-generated current timestamp
      updateAt: new Date(), // Updated timestamp (initially same as createAt)
      // userSociete: [], // Array of associated user accounts
      // categories: [], // Array of product categories
      // clients: [], // Array of associated clients
      // banque: [], // Array of associated banks
      // unite_mesures: [], // Array of measurement units
      // factures: [], // Array of issued invoices
      // produits: [], // Array of products offered
      // mouvements_stock: [], // Array of stock movements
      // logsObr: [], // Array of OBR (fiscal authority) logs
   },
]

// export const clients: Client[] = [
//    {
//       id: 1, // Auto-generated ID
//       nom: 'Acme1 Corporation',
//       NIF: '123456789',
//       type_personne: 'Entreprise',
//       isLocalClient: true,
//       assujetti_tva: true,
//       client_telephone: '123-456-7890',
//       assujetti_tc: true,
//       assujetti_pf: false,
//       client_local: true,
//       client_boite_postal: '1234',
//       client_mail: 'info@acmecorp.com',
//       secteur_activite: 'Fabrication',
//       adresse: 'Nord-Kivu',
//       nom_representant: 'John Doe',
//       telephone_representant: '987-654-3210',
//       mail_representant: 'john.doe@acmecorp.com',
//       // factures: [], // Array of associated factures (invoices)
//       activer: true,
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       // societe: societe, // Associated company object
//    },
//    {
//       id: 2, // Auto-generated ID
//       nom: 'Acme2 Corporation',
//       NIF: '123456789',
//       type_personne: 'Entreprise',
//       isLocalClient: true,
//       assujetti_tva: true,
//       client_telephone: '123-456-7890',
//       assujetti_tc: true,
//       assujetti_pf: false,
//       client_local: true,
//       client_boite_postal: '1234',
//       client_mail: 'info@acmecorp.com',
//       secteur_activite: 'Fabrication',
//       adresse_province: 'Nord-Kivu',
//       adresse_commune: 'Goma',
//       adresse_quartier: 'Les Volcans',
//       adresse_avenue: 'Avenue de la Paix',
//       nom_representant: 'John Doe',
//       telephone_representant: '987-654-3210',
//       mail_representant: 'john.doe@acmecorp.com',
//       // factures: [], // Array of associated factures (invoices)
//       activer: true,
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       // societe: societe, // Associated company object
//    },
//    {
//       id: 3, // Auto-generated ID
//       nom: 'Acme3 Corporation',
//       NIF: '123456789',
//       type_personne: 'Entreprise',
//       isLocalClient: true,
//       assujetti_tva: true,
//       client_telephone: '123-456-7890',
//       assujetti_tc: true,
//       assujetti_pf: false,
//       client_local: true,
//       client_boite_postal: '1234',
//       client_mail: 'info@acmecorp.com',
//       secteur_activite: 'Fabrication',
//       adresse_province: 'Nord-Kivu',
//       adresse_commune: 'Goma',
//       adresse_quartier: 'Les Volcans',
//       adresse_avenue: 'Avenue de la Paix',
//       nom_representant: 'John Doe',
//       telephone_representant: '987-654-3210',
//       mail_representant: 'john.doe@acmecorp.com',
//       // factures: [], // Array of associated factures (invoices)
//       activer: true,
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       // societe: societe, // Associated company object
//    },
// ]

// export const factures: Facture[] = [
//    {
//       id: 1, // Auto-generated ID
//       devise_id: 2, // ID of the associated currency
//       devise: 'USD', // Currency name (e.g., USD, EUR)
//       client_id: 3, // ID of the associated client
//       client: clients[0], // Client details (omitted for brevity) },
//       numeroFacture: 12345, // Invoice number
//       ModePaiement: 'Virement', // Payment method (e.g., Virement, Carte)
//       banque_id: null, // ID of the associated bank (if applicable)
//       // banque: null, // Bank details (omitted if no bank involved)
//       date_paiement: null, // Payment date (if paid)
//       type_facture: 'FT', // Invoice type (e.g., FN=Normal, FT=Avoir)
//       numero_facture_reference: null, // Reference invoice number (if applicable)
//       facture_motif: 'Achat de produits', // Invoice reason
//       facture_signature_electronique: null, // Electronic signature (if applicable)
//       nom_prenom_signateur: null, // Signatory name (if applicable)
//       date_validation_obr: null, // OBR validation date (if applicable)
//       etat_fini: false, // Invoice completion status (initially false)
//       status_obr: false, // OBR status (initially false)
//       electronique_signature: null, // Additional electronic signature
//       // details_facture: [], // Array of invoice details (empty initially)
//       terminer: false, // Invoice completion flag (initially false)
//       sended_to_obr: false, // Sent to OBR flag (initially false)
//       activer: true, // Active status (initially true)
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       //   societe: { // Company details (omitted for brevity) },
//    },
//    {
//       id: 2, // Auto-generated ID
//       devise_id: 2, // ID of the associated currency
//       devise: 'USD', // Currency name (e.g., USD, EUR)
//       client_id: 3, // ID of the associated client
//       client: clients[1], // Client details (omitted for brevity) },
//       numeroFacture: 12345, // Invoice number
//       ModePaiement: 'Virement', // Payment method (e.g., Virement, Carte)
//       banque_id: null, // ID of the associated bank (if applicable)
//       // banque: null, // Bank details (omitted if no bank involved)
//       date_paiement: null, // Payment date (if paid)
//       type_facture: 'FT', // Invoice type (e.g., FN=Normal, FT=Avoir)
//       numero_facture_reference: null, // Reference invoice number (if applicable)
//       facture_motif: 'Achat de produits', // Invoice reason
//       facture_signature_electronique: null, // Electronic signature (if applicable)
//       nom_prenom_signateur: null, // Signatory name (if applicable)
//       date_validation_obr: null, // OBR validation date (if applicable)
//       etat_fini: false, // Invoice completion status (initially false)
//       status_obr: false, // OBR status (initially false)
//       electronique_signature: null, // Additional electronic signature
//       // details_facture: [], // Array of invoice details (empty initially)
//       terminer: false, // Invoice completion flag (initially false)
//       sended_to_obr: false, // Sent to OBR flag (initially false)
//       activer: true, // Active status (initially true)
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       //   societe: { // Company details (omitted for brevity) },
//    },
//    {
//       id: 3, // Auto-generated ID
//       devise_id: 2, // ID of the associated currency
//       devise: 'USD', // Currency name (e.g., USD, EUR)
//       client_id: 3, // ID of the associated client
//       client: clients[2], // Client details (omitted for brevity) },
//       numeroFacture: 12345, // Invoice number
//       ModePaiement: 'Virement', // Payment method (e.g., Virement, Carte)
//       banque_id: null, // ID of the associated bank (if applicable)
//       // banque: null, // Bank details (omitted if no bank involved)
//       date_paiement: null, // Payment date (if paid)
//       type_facture: 'FT', // Invoice type (e.g., FN=Normal, FT=Avoir)
//       numero_facture_reference: null, // Reference invoice number (if applicable)
//       facture_motif: 'Achat de produits', // Invoice reason
//       facture_signature_electronique: null, // Electronic signature (if applicable)
//       nom_prenom_signateur: null, // Signatory name (if applicable)
//       date_validation_obr: null, // OBR validation date (if applicable)
//       etat_fini: false, // Invoice completion status (initially false)
//       status_obr: false, // OBR status (initially false)
//       electronique_signature: null, // Additional electronic signature
//       // details_facture: [], // Array of invoice details (empty initially)
//       terminer: false, // Invoice completion flag (initially false)
//       sended_to_obr: false, // Sent to OBR flag (initially false)
//       activer: true, // Active status (initially true)
//       createAt: new Date(), // Auto-generated current timestamp
//       updateAt: new Date(), // Updated timestamp (initially same as createAt)
//       societe_id: 42, // ID of the associated company
//       //   societe: { // Company details (omitted for brevity) },
//    },
// ]

// export const banques: Banque[] = [
//    {
//       id: 1,
//       nom_bank: 'Bank of America',
//       numero_compte: '1234567890',
//       factures: [factures[0], factures[1]],
//       activer: true,
//       createAt: new Date(),
//       updateAt: new Date(),
//       societe_id: 1,
//       societe: societe,
//    },
//    {
//       id: 2,
//       nom_bank: 'Bank of Africa',
//       numero_compte: '123467897890',
//       factures: [factures[0], factures[2]],
//       activer: true,
//       createAt: new Date(),
//       updateAt: new Date(),
//       societe_id: 1,
//       societe: societe,
//    },
// ]
