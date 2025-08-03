/*
  Warnings:

  - You are about to drop the `PollOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PollOption" DROP CONSTRAINT "PollOption_pollId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_optionId_fkey";

-- DropTable
DROP TABLE "PollOption";

-- CreateTable
CREATE TABLE "poll_optionss" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "poll_optionss_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "poll_optionss" ADD CONSTRAINT "poll_optionss_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "poll_optionss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
