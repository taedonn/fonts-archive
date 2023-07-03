-- CreateTable
CREATE TABLE `fonts` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lang` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `view` INTEGER NOT NULL,
    `font_family` VARCHAR(191) NOT NULL,
    `font_type` VARCHAR(191) NOT NULL,
    `font_weight` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `source_link` VARCHAR(191) NOT NULL,
    `github_link` VARCHAR(191) NOT NULL,
    `cdn_css` VARCHAR(191) NOT NULL,
    `cdn_link` VARCHAR(191) NOT NULL,
    `cdn_import` VARCHAR(191) NOT NULL,
    `cdn_font_face` TEXT NOT NULL,
    `cdn_url` VARCHAR(191) NOT NULL,
    `license_print` VARCHAR(191) NOT NULL,
    `license_web` VARCHAR(191) NOT NULL,
    `license_video` VARCHAR(191) NOT NULL,
    `license_package` VARCHAR(191) NOT NULL,
    `license_embed` VARCHAR(191) NOT NULL,
    `license_bici` VARCHAR(191) NOT NULL,
    `license_ofl` VARCHAR(191) NOT NULL,
    `license_purpose` VARCHAR(191) NOT NULL,
    `license_source` VARCHAR(191) NOT NULL,
    `license` TEXT NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fontsUser` (
    `user_no` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `user_pw` VARCHAR(191) NOT NULL,
    `user_session_id` VARCHAR(191) NOT NULL,
    `user_email_token` VARCHAR(191) NOT NULL,
    `user_email_confirm` BOOLEAN NOT NULL,

    UNIQUE INDEX `fontsUser_user_id_key`(`user_id`),
    PRIMARY KEY (`user_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

