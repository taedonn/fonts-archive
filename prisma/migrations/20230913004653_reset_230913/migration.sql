-- AlterTable
ALTER TABLE `fontsComment` ADD COLUMN `nickname_reported` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `fontsUserReport` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_user_id` INTEGER NOT NULL,
    `comment_id` INTEGER NOT NULL,
    `report_nickname` BOOLEAN NOT NULL DEFAULT false,
    `report_politics` BOOLEAN NOT NULL DEFAULT false,
    `report_swearing` BOOLEAN NOT NULL DEFAULT false,
    `report_etc` BOOLEAN NOT NULL DEFAULT false,
    `report_text` TEXT NOT NULL,

    INDEX `fontsUserReport_report_id_idx`(`report_id`),
    INDEX `fontsUserReport_report_user_id_idx`(`report_user_id`),
    INDEX `fontsUserReport_comment_id_idx`(`comment_id`),
    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fonts_code_idx` ON `fonts`(`code`);

-- CreateIndex
CREATE INDEX `fontsUser_user_no_idx` ON `fontsUser`(`user_no`);
