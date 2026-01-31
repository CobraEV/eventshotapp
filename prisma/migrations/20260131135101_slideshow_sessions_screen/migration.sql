/*
  Warnings:

  - Added the required column `plan` to the `SlideshowSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SlideshowSession" DROP CONSTRAINT "SlideshowSession_eventId_fkey";

-- AlterTable
ALTER TABLE "SlideshowSession" ADD COLUMN     "plan" "PLAN" NOT NULL;

-- AddForeignKey
ALTER TABLE "SlideshowSession" ADD CONSTRAINT "SlideshowSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
