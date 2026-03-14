/*
  Warnings:

  - A unique constraint covering the columns `[title,workAreaId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tasks_title_workAreaId_key` ON `tasks`(`title`, `workAreaId`);
