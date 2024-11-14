-- AlterTable
ALTER TABLE `users` ADD COLUMN `verificationTokenEmail` VARCHAR(191) NULL,
    ADD COLUMN `verificationTokenExpiresEmail` DATETIME(3) NULL;
