-- AlterTable
ALTER TABLE `fonts` MODIFY `view` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `fontsIssue` (
    `issue_id` INTEGER NOT NULL AUTO_INCREMENT,
    `issue_title` VARCHAR(191) NOT NULL,
    `issue_email` VARCHAR(191) NOT NULL,
    `issue_content` TEXT NOT NULL,
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
CREATE TABLE `fontsBugReport` (
    `issue_id` INTEGER NOT NULL AUTO_INCREMENT,
    `issue_title` VARCHAR(191) NOT NULL,
    `issue_email` VARCHAR(191) NOT NULL,
    `issue_content` TEXT NOT NULL,
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

    INDEX `fontsBugReport_issue_id_idx`(`issue_id`),
    PRIMARY KEY (`issue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fontsUser_user_id_idx` ON `fontsUser`(`user_id`);
