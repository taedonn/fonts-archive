-- AlterTable
ALTER TABLE `fontsComment` ADD COLUMN `user_privacy` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `user_public_img` VARCHAR(191) NOT NULL DEFAULT '';
