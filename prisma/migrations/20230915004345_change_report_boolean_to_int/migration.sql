-- AlterTable
ALTER TABLE `fontsComment` MODIFY `reported_etc` INTEGER NOT NULL DEFAULT 0,
    MODIFY `reported_politics` INTEGER NOT NULL DEFAULT 0,
    MODIFY `reported_swearing` INTEGER NOT NULL DEFAULT 0;
