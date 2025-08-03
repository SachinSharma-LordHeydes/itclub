/*
  Warnings:

  - Added the required column `githubLink` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "githubLink" TEXT NOT NULL,
ADD COLUMN     "liveLink" TEXT;
