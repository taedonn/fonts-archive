/*
  Warnings:

  - You are about to drop the column `nickname_reported` on the `fontsComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fontsComment` DROP COLUMN `nickname_reported`;

-- AlterTable
ALTER TABLE `fontsUser` ADD COLUMN `nickname_reported` INTEGER NOT NULL DEFAULT 0;
