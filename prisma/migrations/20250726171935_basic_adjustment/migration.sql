/*
  Warnings:

  - Added the required column `time` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
