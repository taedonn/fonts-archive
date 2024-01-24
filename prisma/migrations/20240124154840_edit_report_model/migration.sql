/*
  Warnings:

  - You are about to drop the column `report_user_auth` on the `fontsUserReport` table. All the data in the column will be lost.
  - You are about to drop the column `report_user_email` on the `fontsUserReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fontsUserReport` DROP COLUMN `report_user_auth`,
    DROP COLUMN `report_user_email`,
    ADD COLUMN `reported_user_id` INTEGER NOT NULL DEFAULT 0;
