-- AlterTable
ALTER TABLE `fontsComment` ADD COLUMN `user_auth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `user_email` VARCHAR(191) NOT NULL DEFAULT '';
