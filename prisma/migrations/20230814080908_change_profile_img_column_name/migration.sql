/*
  Warnings:

  - You are about to drop the column `profile_im` on the `fontsUser` table. All the data in the column will be lost.
  - Added the required column `profile_img` to the `fontsUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fontsUser` DROP COLUMN `profile_im`,
    ADD COLUMN `profile_img` TEXT NOT NULL;
