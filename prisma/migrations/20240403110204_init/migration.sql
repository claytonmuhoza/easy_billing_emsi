-- DropIndex
DROP INDEX `Account_userId_fkey` ON `account`;

-- DropIndex
DROP INDEX `Banque_societe_id_fkey` ON `banque`;

-- DropIndex
DROP INDEX `Categorie_societe_id_fkey` ON `categorie`;

-- DropIndex
DROP INDEX `Client_societe_id_fkey` ON `client`;

-- DropIndex
DROP INDEX `DetailFacture_facture_id_fkey` ON `detailfacture`;

-- DropIndex
DROP INDEX `Facture_banque_id_fkey` ON `facture`;

-- DropIndex
DROP INDEX `Facture_client_id_fkey` ON `facture`;

-- DropIndex
DROP INDEX `Facture_societe_id_fkey` ON `facture`;

-- DropIndex
DROP INDEX `LogOBR_societe_id_fkey` ON `logobr`;

-- DropIndex
DROP INDEX `MouvementStock_facture_reference_id_fkey` ON `mouvementstock`;

-- DropIndex
DROP INDEX `MouvementStock_produit_id_fkey` ON `mouvementstock`;

-- DropIndex
DROP INDEX `MouvementStock_societe_id_fkey` ON `mouvementstock`;

-- DropIndex
DROP INDEX `MouvementStock_unite_mesure_id_fkey` ON `mouvementstock`;

-- DropIndex
DROP INDEX `Produit_categorieId_fkey` ON `produit`;

-- DropIndex
DROP INDEX `Produit_societe_id_fkey` ON `produit`;

-- DropIndex
DROP INDEX `Produit_uniteId_fkey` ON `produit`;

-- DropIndex
DROP INDEX `UniteMesure_societe_id_fkey` ON `unitemesure`;

-- DropIndex
DROP INDEX `UserSociete_societe_id_fkey` ON `usersociete`;

-- AlterTable
ALTER TABLE `mouvementstock` MODIFY `type_mouvement` ENUM('EN', 'ER', 'EI', 'EAJ', 'ET', 'EAU', 'SN', 'SP', 'SD', 'SV', 'SC', 'SAJ', 'ST', 'SAU') NOT NULL;

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
