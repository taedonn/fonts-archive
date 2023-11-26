-- AlterTable
ALTER TABLE `fontsUser` ADD COLUMN `access_token` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL DEFAULT '';
