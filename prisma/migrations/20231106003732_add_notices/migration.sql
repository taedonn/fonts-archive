-- AlterTable
ALTER TABLE `fonts` MODIFY `show_type` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `fontsNotice` (
    `notice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `notice_type` VARCHAR(191) NOT NULL,
    `notice_title` VARCHAR(191) NOT NULL,
    `notice_content` TEXT NOT NULL,
    `notice_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notice_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fontsNotice_notice_id_idx`(`notice_id`),
    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
