/*
  Warnings:

  - You are about to drop the column `highlighting` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `highlighting` BOOLEAN NOT NULL DEFAULT false;
