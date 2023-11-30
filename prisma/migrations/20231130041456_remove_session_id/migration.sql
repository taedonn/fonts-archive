/*
  Warnings:

  - You are about to drop the column `access_token` on the `fontsUser` table. All the data in the column will be lost.
  - You are about to drop the column `user_session_id` on the `fontsUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fontsUser` DROP COLUMN `access_token`,
    DROP COLUMN `user_session_id`;
