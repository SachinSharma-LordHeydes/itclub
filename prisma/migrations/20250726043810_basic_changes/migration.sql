/*
  Warnings:

  - The `status` column on the `polls` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "status",
ADD COLUMN     "status" "PollStatus" NOT NULL DEFAULT 'OPEN';

-- DropEnum
DROP TYPE "PoleStatus";
