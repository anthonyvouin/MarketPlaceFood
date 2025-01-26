/*
  Warnings:

  - The values [SHIP] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PAYMENT_FAILED', 'PAYMENT_PENDING', 'PAYMENT_SUCCEDED', 'PREPARING', 'SEND', 'RECEIVED') NOT NULL DEFAULT 'PAYMENT_PENDING';
