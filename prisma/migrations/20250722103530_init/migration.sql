/*
  Warnings:

  - Changed the type of `status` on the `polls` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PoleStatus" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "status",
ADD COLUMN     "status" "PoleStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
