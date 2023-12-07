/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `fontsUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `fontsUser_user_id_key` ON `fontsUser`;

-- AlterTable
ALTER TABLE `fontsUser` DROP COLUMN `refresh_token`;
