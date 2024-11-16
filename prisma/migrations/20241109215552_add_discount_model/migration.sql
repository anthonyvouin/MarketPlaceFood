-- AlterTable
ALTER TABLE `products` ADD COLUMN `discount_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `discount` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `discount_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
