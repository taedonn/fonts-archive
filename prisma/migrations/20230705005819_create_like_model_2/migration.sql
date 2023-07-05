-- DropIndex
DROP INDEX `fonts_code_idx` ON `fonts`;

-- AlterTable
ALTER TABLE `fonts` ADD COLUMN `liked_user_id` INTEGER NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `fonts_liked_user_id_idx` ON `fonts`(`liked_user_id`);
