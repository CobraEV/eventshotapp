-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "zipKey" TEXT,
ADD COLUMN     "zipReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "zipUpdatedAt" TIMESTAMP(3);
