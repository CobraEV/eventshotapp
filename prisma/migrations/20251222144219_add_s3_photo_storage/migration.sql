/*
  Warnings:

  - You are about to drop the column `filename` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `bucket` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectKey` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "filename",
ADD COLUMN     "bucket" TEXT NOT NULL,
ADD COLUMN     "objectKey" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Photo_eventId_idx" ON "Photo"("eventId");

-- CreateIndex
CREATE INDEX "Photo_approved_idx" ON "Photo"("approved");
