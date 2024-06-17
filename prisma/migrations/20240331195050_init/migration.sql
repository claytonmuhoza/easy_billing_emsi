-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(130) NOT NULL,
    `providerAccountId` VARCHAR(120) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSociete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(200) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    UNIQUE INDEX `UserSociete_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Societe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifiant_system` VARCHAR(191) NOT NULL,
    `mot_de_passe_system` VARCHAR(191) NOT NULL,
    `type_societe` VARCHAR(191) NOT NULL DEFAULT '1',
    `nom` VARCHAR(191) NOT NULL,
    `nif` VARCHAR(191) NOT NULL,
    `rc` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `bp` VARCHAR(191) NULL,
    `forme_juridique` VARCHAR(191) NOT NULL,
    `secteur_activite` VARCHAR(191) NOT NULL,
    `adresse_province` VARCHAR(191) NOT NULL,
    `adresse_commune` VARCHAR(191) NOT NULL,
    `adresse_quartier` VARCHAR(191) NOT NULL,
    `adresse_avenue` VARCHAR(191) NOT NULL,
    `adresse_numero` VARCHAR(191) NULL,
    `tva` BOOLEAN NOT NULL DEFAULT false,
    `taux_tva` DOUBLE NULL,
    `tc` BOOLEAN NOT NULL DEFAULT false,
    `prelevement_forfetaire` BOOLEAN NOT NULL DEFAULT false,
    `direction_fiscale` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(150) NOT NULL,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    UNIQUE INDEX `Categorie_libelle_societe_id_key`(`libelle`, `societe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UniteMesure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(150) NOT NULL,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    UNIQUE INDEX `UniteMesure_libelle_societe_id_key`(`libelle`, `societe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(150) NOT NULL,
    `stock_actuel` DOUBLE NOT NULL DEFAULT 0,
    `stock_minimal_alerte` INTEGER NOT NULL DEFAULT 0,
    `stockable` BOOLEAN NOT NULL,
    `prix_unitaire_revien` DOUBLE NOT NULL DEFAULT 0,
    `prix_unitaire_vente_TTC` DOUBLE NOT NULL DEFAULT 0,
    `categorieId` INTEGER NOT NULL,
    `uniteId` INTEGER NOT NULL,
    `tva` DOUBLE NOT NULL DEFAULT 0,
    `prelevement_forfaitaire` DOUBLE NOT NULL DEFAULT 0,
    `taxe_consomation` DOUBLE NOT NULL DEFAULT 0,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    UNIQUE INDEX `Produit_nom_societe_id_key`(`nom`, `societe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `NIF` VARCHAR(191) NULL,
    `type_personne` VARCHAR(191) NOT NULL,
    `isLocalClient` BOOLEAN NOT NULL DEFAULT true,
    `assujetti_tva` BOOLEAN NOT NULL DEFAULT false,
    `assujetti_tc` BOOLEAN NOT NULL DEFAULT false,
    `assujetti_pf` BOOLEAN NOT NULL DEFAULT false,
    `client_local` BOOLEAN NOT NULL DEFAULT true,
    `client_telephone` VARCHAR(191) NOT NULL DEFAULT '',
    `client_mail` VARCHAR(191) NOT NULL DEFAULT '',
    `client_boite_postal` VARCHAR(191) NOT NULL DEFAULT '',
    `secteur_activite` VARCHAR(191) NOT NULL DEFAULT '',
    `personne_contact_nom` VARCHAR(191) NOT NULL DEFAULT '',
    `personne_contact_telephone` VARCHAR(191) NOT NULL DEFAULT '',
    `adresse` VARCHAR(191) NOT NULL DEFAULT '',
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_bank` VARCHAR(191) NOT NULL,
    `numero_compte` VARCHAR(191) NOT NULL,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_facture` VARCHAR(191) NULL,
    `numero_unique_facture` VARCHAR(191) NULL,
    `devise` VARCHAR(191) NOT NULL DEFAULT 'BIF',
    `taux_devise` DOUBLE NOT NULL DEFAULT 1,
    `client_id` INTEGER NOT NULL,
    `ModePaiement` VARCHAR(191) NOT NULL DEFAULT '1',
    `banque_id` INTEGER NULL,
    `date_paiement` DATETIME(3) NULL,
    `type_facture` VARCHAR(191) NOT NULL DEFAULT 'FN',
    `numero_facture_reference` VARCHAR(191) NULL,
    `facture_motif` VARCHAR(191) NULL,
    `facture_signature_electronique` VARCHAR(191) NULL,
    `nom_prenom_signateur` VARCHAR(191) NULL,
    `date_validation_obr` DATETIME(3) NULL,
    `id_obr` INTEGER NULL,
    `caution` DOUBLE NOT NULL DEFAULT 0,
    `rembourcement_caution` DOUBLE NOT NULL DEFAULT 0,
    `montant_facture` DOUBLE NOT NULL DEFAULT 0,
    `etat_facture` ENUM('non_validee', 'validee', 'annuler') NOT NULL DEFAULT 'non_validee',
    `sended_to_obr` BOOLEAN NOT NULL DEFAULT false,
    `annulation_send_to_obr` BOOLEAN NOT NULL DEFAULT false,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailFacture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facture_id` INTEGER NOT NULL,
    `produit_id` INTEGER NOT NULL,
    `prix_unitaire_vente_hors_tva` DOUBLE NOT NULL,
    `taxe_consomation` DOUBLE NOT NULL DEFAULT 0,
    `prelevement_forfetaire` DOUBLE NOT NULL DEFAULT 0,
    `taxe_service_electronique` DOUBLE NOT NULL DEFAULT 0,
    `prix_unitaire_tva` DOUBLE NOT NULL DEFAULT 0,
    `prix_vente_unitaire` DOUBLE NOT NULL,
    `quantite` DOUBLE NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DetailFacture_produit_id_facture_id_key`(`produit_id`, `facture_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MouvementStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mouv_id_system` VARCHAR(191) NOT NULL,
    `facture_reference_id` INTEGER NULL,
    `type_mouvement` ENUM('EN', 'EI', 'EAJ', 'ET', 'EAU', 'SN', 'SP', 'SV', 'SC', 'SAJ', 'ST', 'SAU') NOT NULL,
    `produit_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `unite_mesure_id` INTEGER NOT NULL,
    `prix_revien` DOUBLE NOT NULL,
    `motif` VARCHAR(191) NULL,
    `envoyer_obr` BOOLEAN NOT NULL DEFAULT false,
    `activer` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogOBR` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `methode` VARCHAR(191) NOT NULL,
    `lien` VARCHAR(191) NULL,
    `code_reponse` INTEGER NOT NULL,
    `message_reponse` VARCHAR(191) NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `signature_electronique` VARCHAR(191) NULL,
    `date_envoi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `societe_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSociete` ADD CONSTRAINT `UserSociete_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSociete` ADD CONSTRAINT `UserSociete_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorie` ADD CONSTRAINT `Categorie_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniteMesure` ADD CONSTRAINT `UniteMesure_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_uniteId_fkey` FOREIGN KEY (`uniteId`) REFERENCES `UniteMesure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banque` ADD CONSTRAINT `Banque_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_banque_id_fkey` FOREIGN KEY (`banque_id`) REFERENCES `Banque`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailFacture` ADD CONSTRAINT `DetailFacture_facture_id_fkey` FOREIGN KEY (`facture_id`) REFERENCES `Facture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailFacture` ADD CONSTRAINT `DetailFacture_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MouvementStock` ADD CONSTRAINT `MouvementStock_facture_reference_id_fkey` FOREIGN KEY (`facture_reference_id`) REFERENCES `Facture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MouvementStock` ADD CONSTRAINT `MouvementStock_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MouvementStock` ADD CONSTRAINT `MouvementStock_unite_mesure_id_fkey` FOREIGN KEY (`unite_mesure_id`) REFERENCES `UniteMesure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MouvementStock` ADD CONSTRAINT `MouvementStock_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogOBR` ADD CONSTRAINT `LogOBR_societe_id_fkey` FOREIGN KEY (`societe_id`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
