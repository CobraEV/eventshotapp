-- CreateTable
CREATE TABLE "EventSlideshowSettings" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "intervalMs" INTEGER NOT NULL DEFAULT 5000,
    "showControls" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSlideshowSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSlideshowSettings_eventId_key" ON "EventSlideshowSettings"("eventId");

-- AddForeignKey
ALTER TABLE "EventSlideshowSettings" ADD CONSTRAINT "EventSlideshowSettings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
