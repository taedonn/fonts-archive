-- AlterTable
ALTER TABLE `fontsComment` ADD COLUMN `reported_etc` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reported_politics` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reported_swearing` BOOLEAN NOT NULL DEFAULT false;
