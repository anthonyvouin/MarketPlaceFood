/*
  Warnings:

  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PAYMENT_FAILED', 'PAYMENT_PENDING', 'PAYMENT_SUCCEDED', 'PREPARING', 'SHIP', 'RECEIVED') NOT NULL DEFAULT 'PAYMENT_PENDING';
