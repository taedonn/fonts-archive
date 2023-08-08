/*
  Warnings:

  - Added the required column `profile_img` to the `fontsUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fontsUser` ADD COLUMN `profile_img` VARCHAR(191) NOT NULL;
