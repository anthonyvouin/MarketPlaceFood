/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `missing_ingredient_reports` table. All the data in the column will be lost.
  - You are about to drop the `_missingingredientreporttorecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_missingingredientreporttorecipe` DROP FOREIGN KEY `_MissingIngredientReportToRecipe_A_fkey`;

-- DropForeignKey
ALTER TABLE `_missingingredientreporttorecipe` DROP FOREIGN KEY `_MissingIngredientReportToRecipe_B_fkey`;

-- AlterTable
ALTER TABLE `missing_ingredient_reports` DROP COLUMN `recipe_id`;

-- AlterTable
ALTER TABLE `recipe_ingredients` ADD COLUMN `missing_ingredient_report_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_missingingredientreporttorecipe`;
