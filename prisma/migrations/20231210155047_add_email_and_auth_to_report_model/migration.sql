-- AlterTable
ALTER TABLE `fontsUserReport` ADD COLUMN `report_user_auth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `report_user_email` VARCHAR(191) NOT NULL DEFAULT '';
