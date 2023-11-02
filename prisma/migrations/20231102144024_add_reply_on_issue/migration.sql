/*
  Warnings:

  - Added the required column `issue_reply` to the `fontsBugReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_reply` to the `fontsIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fontsBugReport` ADD COLUMN `issue_reply` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `fontsIssue` ADD COLUMN `issue_reply` TEXT NOT NULL;
