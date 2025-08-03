/*
  Warnings:

  - The `likes` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "likes",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_projectId_key" ON "likes"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
