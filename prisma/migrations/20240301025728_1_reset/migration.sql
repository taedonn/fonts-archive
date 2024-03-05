/*
  Warnings:

  - You are about to drop the column `user_session_id` on the `fontsUser` table. All the data in the column will be lost.
  - Added the required column `profile_img` to the `fontsUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `fontsUser_user_id_key` ON `fontsUser`;

-- AlterTable
ALTER TABLE `fonts` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `like` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `show_type` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `view` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `fontsUser` DROP COLUMN `user_session_id`,
    ADD COLUMN `auth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `nickname_reported` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `profile_img` TEXT NOT NULL,
    ADD COLUMN `protected` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `public_img` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `fontsLiked` (
    `font_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_email` VARCHAR(191) NOT NULL DEFAULT '',
    `user_auth` VARCHAR(191) NOT NULL DEFAULT '',

    INDEX `fontsLiked_font_id_idx`(`font_id`),
    INDEX `fontsLiked_user_id_idx`(`user_id`),
    PRIMARY KEY (`font_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsComment` (
    `font_id` INTEGER NOT NULL,
    `font_name` VARCHAR(191) NOT NULL DEFAULT '',
    `font_family` VARCHAR(191) NOT NULL DEFAULT '',
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NOT NULL DEFAULT '',
    `user_email` VARCHAR(191) NOT NULL DEFAULT '',
    `user_auth` VARCHAR(191) NOT NULL DEFAULT '',
    `user_image` VARCHAR(191) NOT NULL DEFAULT '',
    `user_privacy` BOOLEAN NOT NULL DEFAULT true,
    `comment` TEXT NOT NULL,
    `depth` INTEGER NOT NULL,
    `bundle_id` INTEGER NOT NULL,
    `bundle_order` INTEGER NOT NULL,
    `reported_politics` INTEGER NOT NULL DEFAULT 0,
    `reported_swearing` INTEGER NOT NULL DEFAULT 0,
    `reported_etc` INTEGER NOT NULL DEFAULT 0,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted_with_reply` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted_by_reports` BOOLEAN NOT NULL DEFAULT false,

    INDEX `fontsComment_font_id_idx`(`font_id`),
    INDEX `fontsComment_user_id_idx`(`user_id`),
    INDEX `fontsComment_comment_id_idx`(`comment_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsUserReport` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_font_code` INTEGER NOT NULL DEFAULT 0,
    `report_user_id` INTEGER NOT NULL,
    `reported_user_id` INTEGER NOT NULL DEFAULT 0,
    `comment_id` INTEGER NOT NULL,
    `report_nickname` BOOLEAN NOT NULL DEFAULT false,
    `report_politics` BOOLEAN NOT NULL DEFAULT false,
    `report_swearing` BOOLEAN NOT NULL DEFAULT false,
    `report_etc` BOOLEAN NOT NULL DEFAULT false,
    `report_text` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fontsUserReport_report_id_idx`(`report_id`),
    INDEX `fontsUserReport_report_user_id_idx`(`report_user_id`),
    INDEX `fontsUserReport_comment_id_idx`(`comment_id`),
    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsIssue` (
    `issue_id` INTEGER NOT NULL AUTO_INCREMENT,
    `issue_title` VARCHAR(191) NOT NULL,
    `issue_email` VARCHAR(191) NOT NULL,
    `issue_content` TEXT NOT NULL,
    `issue_reply` TEXT NOT NULL,
    `issue_type` VARCHAR(191) NOT NULL DEFAULT '',
    `issue_img_length` INTEGER NOT NULL DEFAULT 0,
    `issue_img_1` VARCHAR(191) NOT NULL,
    `issue_img_2` VARCHAR(191) NOT NULL,
    `issue_img_3` VARCHAR(191) NOT NULL,
    `issue_img_4` VARCHAR(191) NOT NULL,
    `issue_img_5` VARCHAR(191) NOT NULL,
    `issue_closed` BOOLEAN NOT NULL DEFAULT false,
    `issue_closed_type` VARCHAR(191) NOT NULL,
    `issue_closed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issue_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fontsIssue_issue_id_idx`(`issue_id`),
    PRIMARY KEY (`issue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsNotice` (
    `notice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `notice_type` VARCHAR(191) NOT NULL,
    `notice_title` VARCHAR(191) NOT NULL,
    `notice_content` TEXT NOT NULL,
    `notice_show_type` BOOLEAN NOT NULL DEFAULT false,
    `notice_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notice_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fontsNotice_notice_id_idx`(`notice_id`),
    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsAlert` (
    `alert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_type` VARCHAR(191) NOT NULL DEFAULT '',
    `alert_read` BOOLEAN NOT NULL DEFAULT false,
    `alert_page` VARCHAR(191) NOT NULL DEFAULT '',
    `alert_link` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_name` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_img` VARCHAR(191) NOT NULL DEFAULT '',
    `sender_content` VARCHAR(191) NOT NULL DEFAULT '',
    `recipent_email` VARCHAR(191) NOT NULL DEFAULT '',
    `recipent_auth` VARCHAR(191) NOT NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comment_id` INTEGER NOT NULL,
    `user_no` INTEGER NOT NULL,

    INDEX `fontsAlert_alert_id_idx`(`alert_id`),
    INDEX `fontsAlert_comment_id_idx`(`comment_id`),
    INDEX `fontsAlert_user_no_idx`(`user_no`),
    PRIMARY KEY (`alert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fonts_code_idx` ON `fonts`(`code`);

-- CreateIndex
CREATE INDEX `fontsUser_user_no_idx` ON `fontsUser`(`user_no`);

-- CreateIndex
CREATE INDEX `fontsUser_user_id_idx` ON `fontsUser`(`user_id`);
