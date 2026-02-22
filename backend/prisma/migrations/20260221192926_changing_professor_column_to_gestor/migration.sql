/*
  Warnings:

  - You are about to drop the column `professor` on the `materials` table. All the data in the column will be lost.
  - Added the required column `gestor` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` DROP COLUMN `professor`,
    ADD COLUMN `gestor` VARCHAR(191) NOT NULL;
