/*
  Warnings:

  - Added the required column `clientId` to the `SlideshowSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlideshowSession" ADD COLUMN     "clientId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SlideshowSession_clientId_idx" ON "SlideshowSession"("clientId");
