-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "guest" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "participant" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resourses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resourses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "exiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "reting" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_clerkId_idx" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "events_userId_key" ON "events"("userId");

-- CreateIndex
CREATE INDEX "events_userId_idx" ON "events"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_userId_key" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "resourses_userId_key" ON "resourses"("userId");

-- CreateIndex
CREATE INDEX "resourses_userId_idx" ON "resourses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "polls_adminId_key" ON "polls"("adminId");

-- CreateIndex
CREATE INDEX "polls_adminId_idx" ON "polls"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_key" ON "ratings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_resourceId_key" ON "ratings"("resourceId");

-- CreateIndex
CREATE INDEX "ratings_userId_idx" ON "ratings"("userId");

-- CreateIndex
CREATE INDEX "ratings_resourceId_idx" ON "ratings"("resourceId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resourses" ADD CONSTRAINT "resourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resourses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
