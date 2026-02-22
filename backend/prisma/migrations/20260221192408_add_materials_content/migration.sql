/*
  Warnings:

  - You are about to drop the column `gestor` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `rota` on the `materials` table. All the data in the column will be lost.
  - Added the required column `arquivoUrl` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professor` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` DROP COLUMN `gestor`,
    DROP COLUMN `rota`,
    ADD COLUMN `arquivoUrl` TEXT NOT NULL,
    ADD COLUMN `descricao` TEXT NOT NULL,
    ADD COLUMN `professor` VARCHAR(191) NOT NULL;
