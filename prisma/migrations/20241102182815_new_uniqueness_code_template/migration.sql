/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `CodeTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CodeTemplate_title_userId_key" ON "CodeTemplate"("title", "userId");
