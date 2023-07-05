/*
  Warnings:

  - You are about to drop the column `liked_user_id` on the `fonts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `fonts_liked_user_id_idx` ON `fonts`;

-- AlterTable
ALTER TABLE `fonts` DROP COLUMN `liked_user_id`,
    ADD COLUMN `liked_user_no` INTEGER NULL;

-- CreateIndex
CREATE INDEX `fonts_liked_user_no_idx` ON `fonts`(`liked_user_no`);
