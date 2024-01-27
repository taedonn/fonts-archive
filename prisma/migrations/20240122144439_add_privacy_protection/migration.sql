-- AlterTable
ALTER TABLE `fontsUser` ADD COLUMN `protected` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `public_img` VARCHAR(191) NOT NULL DEFAULT '';
