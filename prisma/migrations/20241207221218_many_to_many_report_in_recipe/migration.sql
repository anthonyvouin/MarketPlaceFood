/*
  Warnings:

  - You are about to drop the column `missing_ingredient_report_id` on the `recipe_ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipe_ingredients` DROP COLUMN `missing_ingredient_report_id`;

-- CreateTable
CREATE TABLE `recipe_missing_ingredient_reports` (
    `id` VARCHAR(191) NOT NULL,
    `recipe_id` VARCHAR(191) NOT NULL,
    `missing_ingredient_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `recipe_missing_ingredient_reports_recipe_id_missing_ingredie_key`(`recipe_id`, `missing_ingredient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipe_missing_ingredient_reports` ADD CONSTRAINT `recipe_missing_ingredient_reports_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_missing_ingredient_reports` ADD CONSTRAINT `recipe_missing_ingredient_reports_missing_ingredient_id_fkey` FOREIGN KEY (`missing_ingredient_id`) REFERENCES `missing_ingredient_reports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
