/*
  Warnings:

  - The primary key for the `fontsComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `comment_id` to the `fontsComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `fontsComment_bundle_id_idx` ON `fontsComment`;

-- AlterTable
ALTER TABLE `fontsComment` DROP PRIMARY KEY,
    ADD COLUMN `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `bundle_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`comment_id`);

-- CreateIndex
CREATE INDEX `fontsComment_comment_id_idx` ON `fontsComment`(`comment_id`);
