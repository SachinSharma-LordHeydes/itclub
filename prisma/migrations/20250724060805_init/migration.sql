/*
  Warnings:

  - You are about to drop the column `exiresAt` on the `polls` table. All the data in the column will be lost.
  - You are about to drop the column `reting` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the `resourses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `polls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "resourses" DROP CONSTRAINT "resourses_userId_fkey";

-- DropIndex
DROP INDEX "events_userId_key";

-- DropIndex
DROP INDEX "polls_adminId_key";

-- DropIndex
DROP INDEX "projects_userId_key";

-- DropIndex
DROP INDEX "ratings_resourceId_key";

-- DropIndex
DROP INDEX "ratings_userId_key";

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "exiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ratings" DROP COLUMN "reting",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- DropTable
DROP TABLE "resourses";

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "downloads" INTEGER,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resources_userId_idx" ON "resources"("userId");

-- CreateIndex
CREATE INDEX "votes_pollId_idx" ON "votes"("pollId");

-- CreateIndex
CREATE INDEX "votes_userId_idx" ON "votes"("userId");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
