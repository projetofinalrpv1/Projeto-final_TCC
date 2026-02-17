/*
  Warnings:

  - Added the required column `workAreaId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `creator_id` VARCHAR(191) NULL,
    ADD COLUMN `isTemplate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `workAreaId` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_workAreaId_fkey` FOREIGN KEY (`workAreaId`) REFERENCES `work_areas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
