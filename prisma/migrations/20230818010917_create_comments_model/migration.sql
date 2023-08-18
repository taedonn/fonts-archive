-- CreateTable
CREATE TABLE `fontsComment` (
    `font_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `depth` INTEGER NOT NULL,
    `bundle_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bundle_order` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `fontsComment_font_id_idx`(`font_id`),
    INDEX `fontsComment_user_id_idx`(`user_id`),
    INDEX `fontsComment_bundle_id_idx`(`bundle_id`),
    PRIMARY KEY (`font_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
