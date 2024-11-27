-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `cart_item` DROP FOREIGN KEY `cart_item_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_item` DROP FOREIGN KEY `cart_item_product_id_fkey`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
