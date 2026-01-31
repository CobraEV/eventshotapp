-- CreateTable
CREATE TABLE "SlideshowSession" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPing" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlideshowSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SlideshowSession_eventId_idx" ON "SlideshowSession"("eventId");

-- AddForeignKey
ALTER TABLE "SlideshowSession" ADD CONSTRAINT "SlideshowSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
