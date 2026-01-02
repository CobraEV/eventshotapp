-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "photosUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "zipProgress" INTEGER NOT NULL DEFAULT 0;
