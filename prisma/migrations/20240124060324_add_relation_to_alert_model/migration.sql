/*
  Warnings:

  - You are about to drop the column `like` on the `fonts` table. All the data in the column will be lost.
  - You are about to drop the column `bundle_id` on the `fontsAlert` table. All the data in the column will be lost.
  - You are about to drop the column `bundle_order` on the `fontsAlert` table. All the data in the column will be lost.
  - You are about to drop the column `font_id` on the `fontsAlert` table. All the data in the column will be lost.
  - You are about to drop the column `sender_auth` on the `fontsAlert` table. All the data in the column will be lost.
  - You are about to drop the column `sender_email` on the `fontsAlert` table. All the data in the column will be lost.
  - Added the required column `comment_id` to the `fontsAlert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_no` to the `fontsAlert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fonts` DROP COLUMN `like`;

-- AlterTable
ALTER TABLE `fontsAlert` DROP COLUMN `bundle_id`,
    DROP COLUMN `bundle_order`,
    DROP COLUMN `font_id`,
    DROP COLUMN `sender_auth`,
    DROP COLUMN `sender_email`,
    ADD COLUMN `comment_id` INTEGER NOT NULL,
    ADD COLUMN `user_no` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `fontsAlert_comment_id_idx` ON `fontsAlert`(`comment_id`);

-- CreateIndex
CREATE INDEX `fontsAlert_user_no_idx` ON `fontsAlert`(`user_no`);
