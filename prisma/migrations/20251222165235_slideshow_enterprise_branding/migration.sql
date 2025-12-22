-- AlterTable
ALTER TABLE "EventSlideshowSettings" ADD COLUMN     "brandLogoUrl" TEXT,
ADD COLUMN     "hideWatermark" BOOLEAN NOT NULL DEFAULT false;
