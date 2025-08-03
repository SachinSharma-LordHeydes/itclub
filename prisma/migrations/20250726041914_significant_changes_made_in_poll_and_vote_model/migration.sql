/*
  Warnings:

  - You are about to drop the column `options` on the `polls` table. All the data in the column will be lost.
  - You are about to drop the column `option` on the `votes` table. All the data in the column will be lost.
  - Added the required column `optionId` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "polls" DROP COLUMN "options";

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "option",
ADD COLUMN     "optionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
