/*
  Warnings:

  - The `likes` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "likes",
ADD COLUMN     "likes" TEXT[];
