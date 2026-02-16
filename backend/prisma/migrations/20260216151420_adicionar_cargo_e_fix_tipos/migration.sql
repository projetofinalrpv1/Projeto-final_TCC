/*
  Warnings:

  - You are about to drop the column `created_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `prazo` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `prioridade` on the `tasks` table. All the data in the column will be lost.
  - You are about to alter the column `titulo` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - You are about to alter the column `status` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `senha` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Added the required column `updatedAt` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `created_at`,
    DROP COLUMN `prazo`,
    DROP COLUMN `prioridade`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `titulo` VARCHAR(191) NOT NULL,
    MODIFY `descricao` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `nome` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `senha` VARCHAR(191) NOT NULL,
    MODIFY `cargo` ENUM('GESTOR', 'COLABORADOR', 'ADMIN') NOT NULL DEFAULT 'COLABORADOR';
