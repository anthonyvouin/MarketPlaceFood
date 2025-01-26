-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `isPrep` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `send_at` DATETIME(3) NULL;
