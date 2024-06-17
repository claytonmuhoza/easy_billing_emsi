-- CreateEnum
CREATE TYPE "EtatFacture" AS ENUM ('non_validee', 'validee', 'annuler');

-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('EN', 'ER', 'EI', 'EAJ', 'ET', 'EAU', 'SN', 'SP', 'SD', 'SV', 'SC', 'SAJ', 'ST', 'SAU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" VARCHAR(130) NOT NULL,
    "providerAccountId" VARCHAR(120) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSociete" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "UserSociete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Societe" (
    "id" SERIAL NOT NULL,
    "identifiant_system" TEXT NOT NULL,
    "mot_de_passe_system" TEXT NOT NULL,
    "type_societe" TEXT NOT NULL DEFAULT '1',
    "nom" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "rc" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "bp" TEXT,
    "forme_juridique" TEXT NOT NULL,
    "secteur_activite" TEXT NOT NULL,
    "adresse_province" TEXT NOT NULL,
    "adresse_commune" TEXT NOT NULL,
    "adresse_quartier" TEXT NOT NULL,
    "adresse_avenue" TEXT NOT NULL,
    "adresse_numero" TEXT,
    "tva" BOOLEAN NOT NULL DEFAULT false,
    "taux_tva" DOUBLE PRECISION,
    "tc" BOOLEAN NOT NULL DEFAULT false,
    "prelevement_forfetaire" BOOLEAN NOT NULL DEFAULT false,
    "direction_fiscale" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Societe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(150) NOT NULL,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniteMesure" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(150) NOT NULL,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "UniteMesure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "stock_actuel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock_minimal_alerte" INTEGER NOT NULL DEFAULT 0,
    "stockable" BOOLEAN NOT NULL,
    "prix_unitaire_revien" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prix_unitaire_vente_TTC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categorieId" INTEGER NOT NULL,
    "uniteId" INTEGER NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prelevement_forfaitaire" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxe_consomation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "NIF" TEXT,
    "type_personne" TEXT NOT NULL,
    "isLocalClient" BOOLEAN NOT NULL DEFAULT true,
    "assujetti_tva" BOOLEAN NOT NULL DEFAULT false,
    "assujetti_tc" BOOLEAN NOT NULL DEFAULT false,
    "assujetti_pf" BOOLEAN NOT NULL DEFAULT false,
    "client_local" BOOLEAN NOT NULL DEFAULT true,
    "client_telephone" TEXT NOT NULL DEFAULT '',
    "client_mail" TEXT NOT NULL DEFAULT '',
    "client_boite_postal" TEXT NOT NULL DEFAULT '',
    "secteur_activite" TEXT NOT NULL DEFAULT '',
    "personne_contact_nom" TEXT NOT NULL DEFAULT '',
    "personne_contact_telephone" TEXT NOT NULL DEFAULT '',
    "adresse" TEXT NOT NULL DEFAULT '',
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banque" (
    "id" SERIAL NOT NULL,
    "nom_bank" TEXT NOT NULL,
    "numero_compte" TEXT NOT NULL,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "Banque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "numero_facture" TEXT,
    "numero_unique_facture" TEXT,
    "devise" TEXT NOT NULL DEFAULT 'BIF',
    "taux_devise" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "client_id" INTEGER NOT NULL,
    "ModePaiement" TEXT NOT NULL DEFAULT '1',
    "banque_id" INTEGER,
    "date_paiement" TIMESTAMP(3),
    "type_facture" TEXT NOT NULL DEFAULT 'FN',
    "numero_facture_reference" TEXT,
    "facture_motif" TEXT,
    "facture_signature_electronique" TEXT,
    "nom_prenom_signateur" TEXT,
    "date_validation_obr" TIMESTAMP(3),
    "id_obr" INTEGER,
    "caution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rembourcement_caution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montant_facture" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "etat_facture" "EtatFacture" NOT NULL DEFAULT 'non_validee',
    "sended_to_obr" BOOLEAN NOT NULL DEFAULT false,
    "annulation_send_to_obr" BOOLEAN NOT NULL DEFAULT false,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailFacture" (
    "id" SERIAL NOT NULL,
    "facture_id" INTEGER NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "prix_unitaire_vente_hors_tva" DOUBLE PRECISION NOT NULL,
    "taxe_consomation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prelevement_forfetaire" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxe_service_electronique" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prix_unitaire_tva" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prix_vente_unitaire" DOUBLE PRECISION NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailFacture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MouvementStock" (
    "id" SERIAL NOT NULL,
    "mouv_id_system" TEXT NOT NULL,
    "facture_reference_id" INTEGER,
    "type_mouvement" "TypeMouvement" NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "unite_mesure_id" INTEGER NOT NULL,
    "prix_revien" DOUBLE PRECISION NOT NULL,
    "motif" TEXT,
    "envoyer_obr" BOOLEAN NOT NULL DEFAULT false,
    "activer" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "MouvementStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogOBR" (
    "id" SERIAL NOT NULL,
    "methode" TEXT NOT NULL,
    "lien" TEXT,
    "code_reponse" INTEGER NOT NULL,
    "message_reponse" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "signature_electronique" TEXT,
    "date_envoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "societe_id" INTEGER NOT NULL,

    CONSTRAINT "LogOBR_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSociete_user_id_key" ON "UserSociete"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categorie_libelle_societe_id_key" ON "Categorie"("libelle", "societe_id");

-- CreateIndex
CREATE UNIQUE INDEX "UniteMesure_libelle_societe_id_key" ON "UniteMesure"("libelle", "societe_id");

-- CreateIndex
CREATE UNIQUE INDEX "Produit_nom_societe_id_key" ON "Produit"("nom", "societe_id");

-- CreateIndex
CREATE UNIQUE INDEX "DetailFacture_produit_id_facture_id_key" ON "DetailFacture"("produit_id", "facture_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSociete" ADD CONSTRAINT "UserSociete_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSociete" ADD CONSTRAINT "UserSociete_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniteMesure" ADD CONSTRAINT "UniteMesure_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_uniteId_fkey" FOREIGN KEY ("uniteId") REFERENCES "UniteMesure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banque" ADD CONSTRAINT "Banque_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_banque_id_fkey" FOREIGN KEY ("banque_id") REFERENCES "Banque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailFacture" ADD CONSTRAINT "DetailFacture_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailFacture" ADD CONSTRAINT "DetailFacture_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_facture_reference_id_fkey" FOREIGN KEY ("facture_reference_id") REFERENCES "Facture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_unite_mesure_id_fkey" FOREIGN KEY ("unite_mesure_id") REFERENCES "UniteMesure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogOBR" ADD CONSTRAINT "LogOBR_societe_id_fkey" FOREIGN KEY ("societe_id") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
