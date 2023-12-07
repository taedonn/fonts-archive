-- AlterTable
ALTER TABLE `fontsComment` ADD COLUMN `font_family` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `font_name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `fontsLiked` ADD COLUMN `user_email` VARCHAR(191) NOT NULL DEFAULT '';
