/*
  Warnings:

  - You are about to drop the column `liked_user_no` on the `fonts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `fonts_liked_user_no_idx` ON `fonts`;

-- AlterTable
ALTER TABLE `fonts` DROP COLUMN `liked_user_no`;

-- CreateTable
CREATE TABLE `fontsLiked` (
    `font_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `fontsLiked_font_id_idx`(`font_id`),
    INDEX `fontsLiked_user_id_idx`(`user_id`),
    PRIMARY KEY (`font_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
