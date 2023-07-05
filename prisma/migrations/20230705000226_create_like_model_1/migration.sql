/*
  Warnings:

  - You are about to drop the `fontsLiked` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `fontsLiked`;

-- CreateIndex
CREATE INDEX `fonts_code_idx` ON `fonts`(`code`);
