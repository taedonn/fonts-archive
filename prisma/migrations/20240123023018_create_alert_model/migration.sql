/*
  Warnings:

  - You are about to drop the column `user_public_img` on the `fontsComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fontsComment` DROP COLUMN `user_public_img`;

-- CreateTable
CREATE TABLE `fontsAlert` (
    `alert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_type` VARCHAR(191) NOT NULL DEFAULT '',
    `alert_read` BOOLEAN NOT NULL DEFAULT false,
    `alert_page` VARCHAR(191) NOT NULL DEFAULT '',
    `alert_link` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_name` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_img` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_content` VARCHAR(191) NOT NULL DEFAULT '',
    `recipent_email` VARCHAR(191) NOT NULL DEFAULT '',
    `recipent_auth` VARCHAR(191) NOT NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fontsAlert_alert_id_idx`(`alert_id`),
    PRIMARY KEY (`alert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
