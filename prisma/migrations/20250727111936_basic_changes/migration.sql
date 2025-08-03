/*
  Warnings:

  - The `tags` column on the `events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `downloads` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `day` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceLink` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Days" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "day" "Days" NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "downloads",
DROP COLUMN "rating",
ADD COLUMN     "resourceLink" TEXT NOT NULL;

-- DropTable
DROP TABLE "ratings";
