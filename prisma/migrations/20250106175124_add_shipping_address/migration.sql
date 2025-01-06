/*
  Warnings:

  - Added the required column `shipping_address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_city` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_phone_number` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_zip_code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipping_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipping_address_add` VARCHAR(191) NULL,
    ADD COLUMN `shipping_city` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipping_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipping_note` TEXT NULL,
    ADD COLUMN `shipping_phone_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipping_zip_code` VARCHAR(191) NOT NULL;
