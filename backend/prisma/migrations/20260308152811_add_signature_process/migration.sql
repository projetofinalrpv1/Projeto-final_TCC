-- CreateTable
CREATE TABLE `signature_processes` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `workAreaId` VARCHAR(191) NOT NULL,
    `employeeSignature` VARCHAR(191) NOT NULL,
    `managerSignature` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `pdfUrl` TEXT NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `signature_processes` ADD CONSTRAINT `signature_processes_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `signature_processes` ADD CONSTRAINT `signature_processes_workAreaId_fkey` FOREIGN KEY (`workAreaId`) REFERENCES `work_areas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
