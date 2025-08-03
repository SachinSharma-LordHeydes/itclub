/*
  Warnings:

  - You are about to drop the column `topic` on the `resources` table. All the data in the column will be lost.
  - Added the required column `category` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "topic",
ADD COLUMN     "category" TEXT NOT NULL;
