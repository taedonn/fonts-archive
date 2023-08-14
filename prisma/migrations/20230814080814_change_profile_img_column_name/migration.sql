/*
  Warnings:

  - You are about to drop the column `profile_img` on the `fontsUser` table. All the data in the column will be lost.
  - Added the required column `profile_im` to the `fontsUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fontsUser` DROP COLUMN `profile_img`,
    ADD COLUMN `profile_im` TEXT NOT NULL;
