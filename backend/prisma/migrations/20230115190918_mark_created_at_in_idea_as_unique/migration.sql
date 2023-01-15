/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `Idea` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Idea_createdAt_key" ON "Idea"("createdAt");
